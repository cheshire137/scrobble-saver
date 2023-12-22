package server

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/cheshire137/lastly-likes/pkg/spotify"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

func (e *Env) SpotifySearchTracksHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)

	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	spotifyUserId, isSignedIntoSpotify := session.Values[spotify.SpotifyUserIdSessionKey].(string)
	if !isSignedIntoSpotify {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	spotifyUser, err := e.ds.LoadSpotifyUser(spotifyUserId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	api := spotify.NewAuthenticatedApi(e.config, e.ds, spotifyUser, session)
	limitStr := r.URL.Query().Get("limit")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 50
	}
	offsetStr := r.URL.Query().Get("offset")
	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}
	artist := r.URL.Query().Get("artist")
	album := r.URL.Query().Get("album")
	track := r.URL.Query().Get("track")

	w.Header().Set("Content-Type", "application/json")

	searchTracksResp, err := api.SearchTracks(artist, album, track, limit, offset)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to search tracks: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	json.NewEncoder(w).Encode(searchTracksResp.Tracks)
}
