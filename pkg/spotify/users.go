package spotify

import (
	"fmt"
	"net/http"
	"net/url"
	"sort"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/util"
)

type GetCurrentUserResponse struct {
	DisplayName  string `json:"display_name"`
	Href         string `json:"href"`
	Id           string `json:"id"`
	ExternalUrls struct {
		Spotify string `json:"spotify"`
	} `json:"external_urls"`
	Images []struct {
		Height int    `json:"height"`
		Url    string `json:"url"`
		Width  int    `json:"width"`
	} `json:"images"`
}

// https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
func (a *Api) GetCurrentUser() (*GetCurrentUserResponse, *util.RequestError) {
	path := "/me"
	params := url.Values{}
	paramsForCache := a.getParamsStr(params)
	var response GetCurrentUserResponse

	cacheHit, err := a.loadCachedResponse(path, paramsForCache, a.spotifyUser.Id, &response)
	if err != nil {
		util.LogError("Failed to use cached Spotify current user response:", err)
		return nil, util.NewRequestError(http.StatusInternalServerError, err)
	}
	if cacheHit {
		return &response, nil
	}

	requestErr := a.get(path, params, &response)
	if requestErr != nil {
		util.LogError("Failed to get current Spotify user:", requestErr.Err)
		return nil, requestErr
	}

	userId := response.Id
	a.cacheResponse(response, path, paramsForCache, userId)
	return &response, nil
}

// https://developer.spotify.com/documentation/web-api/reference/save-tracks-user
func (a *Api) SaveTracks(trackIDs []string) *util.RequestError {
	sort.Strings(trackIDs)
	batchesOfTrackIDs := util.ChunkSlice(trackIDs, 50)
	for _, batch := range batchesOfTrackIDs {
		requestErr := a.saveBatchOfTracks(batch)
		if requestErr != nil {
			return requestErr
		}
	}
	return nil
}

type CheckSavedTracksResponse map[string]bool

// https://developer.spotify.com/documentation/web-api/reference/check-users-saved-tracks
func (a *Api) CheckSavedTracks(trackIDs []string) (*CheckSavedTracksResponse, *util.RequestError) {
	sort.Strings(trackIDs)
	batchesOfTrackIDs := util.ChunkSlice(trackIDs, 50)
	result := make(CheckSavedTracksResponse)
	for _, batch := range batchesOfTrackIDs {
		batchResult, requestErr := a.checkBatchOfSavedTracks(batch)
		if requestErr != nil {
			return nil, requestErr
		}
		for trackID, isSaved := range *batchResult {
			result[trackID] = isSaved
		}
	}
	return &result, nil
}

type SaveTracksRequestBody struct {
	TrackIds []string `json:"ids"`
}

func (a *Api) saveBatchOfTracks(trackIDs []string) *util.RequestError {
	if len(trackIDs) > 50 {
		err := fmt.Errorf("cannot save more than 50 tracks at a time, got %d", len(trackIDs))
		return util.NewRequestError(http.StatusInternalServerError, err)
	}

	path := "/me/tracks"
	body := SaveTracksRequestBody{TrackIds: trackIDs}

	requestErr := a.put(path, &body)
	if requestErr != nil {
		if requestErr.StatusCode != 401 {
			util.LogError("Failed to save Spotify tracks:", requestErr.Err)
			return requestErr
		}

		requestErr = a.refreshSpotifyToken()
		if requestErr != nil {
			return requestErr
		}

		// Try the original request once more, now with an updated access token:
		requestErr = a.put(path, &body)
		if requestErr != nil {
			util.LogError("Failed to save Spotify tracks after refreshing token:", requestErr.Err)
			return requestErr
		}
	}

	return nil
}

func (a *Api) checkBatchOfSavedTracks(trackIDs []string) (*CheckSavedTracksResponse, *util.RequestError) {
	if len(trackIDs) > 50 {
		err := fmt.Errorf("cannot check more than 50 track IDs at a time, got %d", len(trackIDs))
		return nil, util.NewRequestError(http.StatusInternalServerError, err)
	}
	path := "/me/tracks/contains"
	params := url.Values{}
	params.Add("ids", strings.Join(trackIDs, ","))
	paramsForCache := a.getParamsStr(params)
	var response []bool

	cacheHit, err := a.loadCachedResponse(path, paramsForCache, a.spotifyUser.Id, &response)
	if err != nil {
		util.LogError("Failed to use cached response for checking saved Spotify tracks:", err)
		return nil, util.NewRequestError(http.StatusInternalServerError, err)
	}
	if cacheHit {
		result := zipCheckSavedTracksResponse(trackIDs, response)
		return result, nil
	}

	requestErr := a.get(path, params, &response)
	if requestErr != nil {
		if requestErr.StatusCode != 401 {
			util.LogError("Failed to check Spotify saved tracks:", requestErr.Err)
			return nil, requestErr
		}

		requestErr = a.refreshSpotifyToken()
		if requestErr != nil {
			return nil, requestErr
		}

		// Try the original request once more, now with an updated access token:
		requestErr = a.get(path, params, &response)
		if requestErr != nil {
			util.LogError("Failed to check Spotify saved tracks after refreshing token:", requestErr.Err)
			return nil, requestErr
		}
	}

	a.cacheResponse(response, path, paramsForCache, a.spotifyUser.Id)
	result := zipCheckSavedTracksResponse(trackIDs, response)
	return result, nil
}

func zipCheckSavedTracksResponse(trackIDs []string, response []bool) *CheckSavedTracksResponse {
	isTrackSavedByTrackID := make(CheckSavedTracksResponse)
	for i, trackID := range trackIDs {
		isTrackSavedByTrackID[trackID] = response[i]
	}
	return &isTrackSavedByTrackID
}
