package server

import (
	"encoding/json"
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/data_store"
	"github.com/cheshire137/lastly-likes/pkg/lastfm"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func (e *Env) LastfmAuthHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	token := r.URL.Query().Get("token")

	api := lastfm.NewApi(e.config)
	sessionResp := api.GetSession(token)

	w.Header().Set("Content-Type", "application/json")
	if sessionResp == nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to sign in with Last.fm"})
		return
	}

	lastfmUser := data_store.LastfmUser{
		Name:       sessionResp.Session.Name,
		SessionKey: sessionResp.Session.Key,
	}
	err := e.ds.UpsertLastfmUser(&lastfmUser)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to create your account: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	json.NewEncoder(w).Encode(lastfmUser)
}
