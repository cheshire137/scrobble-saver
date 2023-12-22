package server

import (
	"fmt"
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/config"
	"github.com/cheshire137/lastly-likes/pkg/data_store"
	"github.com/cheshire137/lastly-likes/pkg/spotify"
	"github.com/cheshire137/lastly-likes/pkg/util"
	"github.com/gorilla/sessions"
)

type Env struct {
	ds     *data_store.DataStore
	config *config.Config
	store  *sessions.CookieStore
}

func NewEnv(ds *data_store.DataStore, config *config.Config) *Env {
	store := sessions.NewCookieStore([]byte(config.Secret))
	return &Env{ds: ds, config: config, store: store}
}

func (e *Env) RedirectToFrontendHandler(w http.ResponseWriter, r *http.Request) {
	util.LogRequest(r)
	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	lastfmUsername, isSignedIntoLastfm := session.Values[lastfmUsernameKey].(string)
	path := ""
	if isSignedIntoLastfm {
		path = fmt.Sprintf("/#/lastfm/%s", lastfmUsername)
		spotifyUserId, isSignedIntoSpotify := session.Values[spotify.SpotifyUserIdSessionKey].(string)
		if isSignedIntoSpotify {
			path = fmt.Sprintf("%s/spotify/%s", path, spotifyUserId)
		}
	}
	frontendUrl := fmt.Sprintf("http://localhost:%d%s", e.config.FrontendPort, path)
	util.LogInfo("Redirecting to frontend: %s", frontendUrl)
	http.Redirect(w, r, frontendUrl, http.StatusSeeOther)
}

func (e *Env) enableCors(w *http.ResponseWriter) {
	allowedUrl := fmt.Sprintf("http://localhost:%d", e.config.FrontendPort)
	(*w).Header().Set("Access-Control-Allow-Origin", allowedUrl)
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}
