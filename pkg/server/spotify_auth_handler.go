package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/data_store"
	"github.com/cheshire137/lastly-likes/pkg/spotify"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

func (e *Env) SpotifyAuthHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	error := r.URL.Query().Get("error")
	if error != "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to sign in with Spotify: " + error
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	code := r.URL.Query().Get("code")
	api := spotify.NewApi(e.config, e.ds)

	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tokenResp, err := api.GetToken(code)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to sign in with Spotify: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	spotifyUser := data_store.SpotifyUser{
		AccessToken:  tokenResp.AccessToken,
		RefreshToken: tokenResp.RefreshToken,
		Scopes:       tokenResp.Scope,
		ExpiresIn:    tokenResp.ExpiresIn,
	}
	api = spotify.NewAuthenticatedApi(e.config, e.ds, &spotifyUser, session)
	userResp, err := api.GetCurrentUser()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to fetch account details from Spotify: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	spotifyUser.Id = userResp.Id
	err = e.ds.UpsertSpotifyUser(&spotifyUser)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to save Spotify details: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	util.LogInfo("Setting session value for key %s to %s", spotifyUserIdKey, spotifyUser.Id)
	session.Values[spotifyUserIdKey] = spotifyUser.Id
	session.Save(r, w)

	http.Redirect(w, r, fmt.Sprintf("http://localhost:%d#/spotify/%s", e.config.FrontendPort, spotifyUser.Id),
		http.StatusSeeOther)
}
