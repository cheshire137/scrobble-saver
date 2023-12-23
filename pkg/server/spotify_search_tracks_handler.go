package server

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/cheshire137/scrobble-saver/pkg/spotify"
	"github.com/cheshire137/scrobble-saver/pkg/util"
)

func (e *Env) SpotifySearchTracksHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	w.Header().Set("Content-Type", "application/json")

	session, err := e.store.Get(r, cookieName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to search tracks: " + err.Error()})
		return
	}

	spotifyUserId, isSignedIntoSpotify := session.Values[spotify.SpotifyUserIdSessionKey].(string)
	if !isSignedIntoSpotify {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Not authenticated with Spotify"})
		return
	}

	spotifyUser, err := e.ds.LoadSpotifyUser(spotifyUserId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to search tracks: " + err.Error()})
		return
	}

	api := spotify.NewAuthenticatedApi(e.config, e.ds, spotifyUser, session, w, r)
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

	searchTracksResp, requestErr := api.SearchTracks(artist, album, track, limit, offset)
	if requestErr != nil {
		w.WriteHeader(requestErr.StatusCode)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to search tracks: " + requestErr.Error()})
		return
	}

	json.NewEncoder(w).Encode(searchTracksResp.Tracks)
}
