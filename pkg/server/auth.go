package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/util"
)

const cookieName = "lastly-likes"
const spotifyUserIdKey = "spotifyUserId"
const lastfmUsernameKey = "lastfmUsername"

type MeResponse struct {
	SpotifyUserId  string `json:"spotifyUserId"`
	LastfmUsername string `json:"lastfmUsername"`
}

func (e *Env) MeHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	spotifyUserId, isSignedIntoSpotify := session.Values[spotifyUserIdKey].(string)
	if !isSignedIntoSpotify {
		spotifyUserId = ""
	}
	lastfmUsername, isSignedIntoLastfm := session.Values[lastfmUsernameKey].(string)
	if !isSignedIntoLastfm {
		lastfmUsername = ""
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(MeResponse{SpotifyUserId: spotifyUserId, LastfmUsername: lastfmUsername})
}

func (e *Env) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values[spotifyUserIdKey] = nil
	session.Values[lastfmUsernameKey] = nil
	session.Save(r, w)
	http.Redirect(w, r, fmt.Sprintf("http://localhost:%d", e.config.FrontendPort), http.StatusSeeOther)
}
