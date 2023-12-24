package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cheshire137/scrobble-saver/pkg/data_store"
	"github.com/cheshire137/scrobble-saver/pkg/lastfm"
	"github.com/cheshire137/scrobble-saver/pkg/util"
)

func (e *Env) LastfmAuthHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	token := r.URL.Query().Get("token")
	api := lastfm.NewApi(e.config, e.ds)

	sessionResp, requestErr := api.GetSession(token)
	if requestErr != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(requestErr.StatusCode)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to sign in with Last.fm: " + requestErr.Error()})
		return
	}

	lastfmUser := data_store.LastfmUser{
		Name:       sessionResp.Session.Name,
		SessionKey: sessionResp.Session.Key,
	}
	err := e.ds.UpsertLastfmUser(&lastfmUser)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to sign in with Last.fm: " + err.Error()})
		return
	}

	session, err := e.store.Get(r, cookieName)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to sign in with Last.fm: " + err.Error()})
		return
	}
	util.LogInfo("Setting session value for key %s to %s", lastfmUsernameKey, lastfmUser.Name)
	session.Values[lastfmUsernameKey] = lastfmUser.Name

	err = session.Save(r, w)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to clear your session: " + err.Error()})
		return
	}

	http.Redirect(w, r, fmt.Sprintf("http://localhost:%d#/lastfm", e.config.FrontendPort), http.StatusSeeOther)
}
