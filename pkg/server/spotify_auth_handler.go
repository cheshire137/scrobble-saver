package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cheshire137/scrobble-saver/pkg/data_store"
	"github.com/cheshire137/scrobble-saver/pkg/spotify"
	"github.com/cheshire137/scrobble-saver/pkg/util"
)

func (e *Env) SpotifyAuthHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	errorMessage := r.URL.Query().Get("error")
	if errorMessage != "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to sign in with Spotify: " + errorMessage})
		return
	}

	code := r.URL.Query().Get("code")
	api := spotify.NewApi(e.config, e.ds)

	session, err := e.store.Get(r, cookieName)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to sign in with Spotify: " + err.Error()})
		return
	}

	tokenResp, requestErr := api.GetToken(code)
	if requestErr != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(requestErr.StatusCode)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to sign in with Spotify: " + requestErr.Error()})
		return
	}

	spotifyUser := data_store.SpotifyUser{
		AccessToken:  tokenResp.AccessToken,
		RefreshToken: tokenResp.RefreshToken,
		Scopes:       tokenResp.Scope,
		ExpiresIn:    tokenResp.ExpiresIn,
	}
	api = spotify.NewAuthenticatedApi(e.config, e.ds, &spotifyUser, session, w, r)
	userResp, requestErr := api.GetCurrentUser()
	if requestErr != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(requestErr.StatusCode)
		message := "Failed to fetch account details from Spotify: " + requestErr.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	spotifyUser.Id = userResp.Id
	err = e.ds.UpsertSpotifyUser(&spotifyUser)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to save Spotify details: " + err.Error()})
		return
	}

	util.LogInfo("Setting session value for key %s to %s", spotify.SpotifyUserIdSessionKey, spotifyUser.Id)
	session.Values[spotify.SpotifyUserIdSessionKey] = spotifyUser.Id

	err = session.Save(r, w)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to save your session: " + err.Error()})
		return
	}

	http.Redirect(w, r, fmt.Sprintf("http://localhost:%d#/spotify", e.config.FrontendPort), http.StatusSeeOther)
}
