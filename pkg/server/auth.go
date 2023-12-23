package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cheshire137/scrobble-saver/pkg/spotify"
	"github.com/cheshire137/scrobble-saver/pkg/util"
)

const cookieName = "scrobble-saver"
const lastfmUsernameKey = "lastfmUsername"

type MeResponse struct {
	SpotifyUserId       string `json:"spotifyUserId"`
	LastfmUsername      string `json:"lastfmUsername"`
	IsSignedIntoLastfm  bool   `json:"isSignedIntoLastfm"`
	IsSignedIntoSpotify bool   `json:"isSignedIntoSpotify"`
}

func (e *Env) MeHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	spotifyUserId, isSignedIntoSpotify := session.Values[spotify.SpotifyUserIdSessionKey].(string)
	lastfmUsername, isSignedIntoLastfm := session.Values[lastfmUsernameKey].(string)
	response := MeResponse{SpotifyUserId: spotifyUserId, LastfmUsername: lastfmUsername,
		IsSignedIntoLastfm: isSignedIntoLastfm, IsSignedIntoSpotify: isSignedIntoSpotify}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (e *Env) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values[spotify.SpotifyUserIdSessionKey] = nil
	session.Values[lastfmUsernameKey] = nil
	util.LogInfo("Clearing session values for %s and %s", spotify.SpotifyUserIdSessionKey, lastfmUsernameKey)

	err = session.Save(r, w)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to clear your session: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	http.Redirect(w, r, fmt.Sprintf("http://localhost:%d", e.config.FrontendPort), http.StatusSeeOther)
}
