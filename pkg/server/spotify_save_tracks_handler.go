package server

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/spotify"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

func (e *Env) SpotifySaveTracksHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Method not allowed"})
		return
	}

	session, err := e.store.Get(r, cookieName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to save tracks: " + err.Error()})
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
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to save tracks: " + err.Error()})
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

	requestErr := api.SaveTracks(trackIDs)
	if requestErr != nil {
		w.WriteHeader(requestErr.StatusCode)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to save tracks: " + requestErr.Error()})
		return
	}

	e.ds.ClearCachedResponsesForPath(spotify.CheckSavedTracksPath, spotifyUserId)

	response := spotify.SaveTracksRequestBody{TrackIds: trackIDs}
	json.NewEncoder(w).Encode(response)
}
