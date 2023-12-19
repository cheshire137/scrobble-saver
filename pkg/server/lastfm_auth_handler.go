package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/data_store"
	"github.com/cheshire137/lastly-likes/pkg/lastfm"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

func (e *Env) LastfmAuthHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	token := r.URL.Query().Get("token")
	api := lastfm.NewApi(e.config, e.ds)

	sessionResp, err := api.GetSession(token)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to sign in with Last.fm: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	lastfmUser := data_store.LastfmUser{
		Name:       sessionResp.Session.Name,
		SessionKey: sessionResp.Session.Key,
	}
	err = e.ds.UpsertLastfmUser(&lastfmUser)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to create your account: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	util.LogInfo("Setting session value for key %s to %s", lastfmUsernameKey, lastfmUser.Name)
	session.Values[lastfmUsernameKey] = lastfmUser.Name
	session.Save(r, w)

	http.Redirect(w, r, fmt.Sprintf("http://localhost:%d#/lastfm/%s", e.config.FrontendPort, lastfmUser.Name),
		http.StatusSeeOther)
}
