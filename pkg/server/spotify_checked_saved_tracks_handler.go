package server

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/spotify"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

func (e *Env) SpotifyCheckSavedTracksHandler(w http.ResponseWriter, r *http.Request) {
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

	w.Header().Set("Content-Type", "application/json")
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
		message := "Failed to check saved tracks: " + requestErr.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	json.NewEncoder(w).Encode(checkSavedTracksResponse)
}
