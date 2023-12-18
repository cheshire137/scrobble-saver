package server

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/cheshire137/lastly-likes/pkg/lastfm"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

func (e *Env) LastfmTopTracksHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
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
	api := lastfm.NewApi(e.config)
	topTracksResp, err := api.GetTopTracks(user, period, limit, page)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to get user's top tracks: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(topTracksResp)
}
