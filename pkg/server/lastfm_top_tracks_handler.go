package server

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/cheshire137/scrobble-saver/pkg/lastfm"
	"github.com/cheshire137/scrobble-saver/pkg/util"
)

func (e *Env) LastfmTopTracksHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	w.Header().Set("Content-Type", "application/json")

	session, err := e.store.Get(r, cookieName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to get user's top tracks: " + err.Error()})
		return
	}

	lastfmUsername, isSignedIntoLastfm := session.Values[lastfmUsernameKey].(string)
	if !isSignedIntoLastfm {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Not authenticated with Last.fm"})
		return
	}

	lastfmUser, err := e.ds.LoadLastfmUser(lastfmUsername)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to get user's top tracks: " + err.Error()})
		return
	}

	period := r.URL.Query().Get("period")
	limitStr := r.URL.Query().Get("limit")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 50
	}
	pageStr := r.URL.Query().Get("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		page = 1
	}
	api := lastfm.NewAuthenticatedApi(e.config, e.ds, lastfmUser)

	topTracksResp, requestErr := api.GetTopTracks(period, limit, page)
	if requestErr != nil {
		w.WriteHeader(requestErr.StatusCode)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to get user's top tracks: " + requestErr.Error()})
		return
	}

	json.NewEncoder(w).Encode(topTracksResp.TopTracks)
}
