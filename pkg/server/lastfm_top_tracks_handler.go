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

	user := r.URL.Query().Get("user")
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
	api := lastfm.NewApi(e.config, e.ds)

	topTracksResp, requestErr := api.GetTopTracks(user, period, limit, page)
	if requestErr != nil {
		w.WriteHeader(requestErr.StatusCode)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to get user's top tracks: " + requestErr.Error()})
		return
	}

	json.NewEncoder(w).Encode(topTracksResp.TopTracks)
}
