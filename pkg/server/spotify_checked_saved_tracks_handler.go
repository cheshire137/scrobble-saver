package server

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/cheshire137/scrobble-saver/pkg/spotify"
	"github.com/cheshire137/scrobble-saver/pkg/util"
)

func (e *Env) SpotifyCheckSavedTracksHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	w.Header().Set("Content-Type", "application/json")

	session, err := e.store.Get(r, cookieName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to check saved tracks: " + err.Error()})
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
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to check saved tracks: " + err.Error()})
		return
	}

	api := spotify.NewAuthenticatedApi(e.config, e.ds, spotifyUser, session, w, r)
	trackIDsStr := r.URL.Query().Get("track_ids")
	trackIDs := strings.Split(trackIDsStr, ",")
	if len(trackIDs) < 1 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "No Spotify track IDs specified"})
		return
	}

	checkSavedTracksResponse, requestErr := api.CheckSavedTracks(trackIDs)
	if requestErr != nil {
		w.WriteHeader(requestErr.StatusCode)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to check saved tracks: " + requestErr.Error()})
		return
	}

	json.NewEncoder(w).Encode(checkSavedTracksResponse)
}
