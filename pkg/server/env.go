package server

import (
	"fmt"
	"net/http"

	"github.com/cheshire137/scrobble-saver/pkg/config"
	"github.com/cheshire137/scrobble-saver/pkg/data_store"
	"github.com/cheshire137/scrobble-saver/pkg/spotify"
	"github.com/cheshire137/scrobble-saver/pkg/util"
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
	_, isSignedIntoLastfm := session.Values[lastfmUsernameKey].(string)
	path := ""
	if isSignedIntoLastfm {
		_, isSignedIntoSpotify := session.Values[spotify.SpotifyUserIdSessionKey].(string)
		if isSignedIntoSpotify {
			path = "/#/spotify"
		} else {
			path = "/#/lastfm"
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
