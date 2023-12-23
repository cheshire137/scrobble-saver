package spotify

import (
	"fmt"
	"net/http"
	"net/url"
	"sort"
	"strconv"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/util"
)

type ExternalUrls struct {
	Spotify string `json:"spotify"`
}

type Image struct {
	Height int    `json:"height"`
	Width  int    `json:"width"`
	Url    string `json:"url"`
}

type SearchResponse struct {
	Tracks struct {
		Href  string `json:"href"`
		Total int    `json:"total"`
		Items []struct {
			DiscNumber   int          `json:"disc_number"`
			DurationMs   int          `json:"duration_ms"`
			Explicit     bool         `json:"explicit"`
			ExternalUrls ExternalUrls `json:"external_urls"`
			Href         string       `json:"href"`
			Id           string       `json:"id"`
			Name         string       `json:"name"`
			TrackNumber  int          `json:"track_number"`
			Uri          string       `json:"uri"`
			Album        struct {
				AlbumType string `json:"album_type"`
				Artists   []struct {
					ExternalUrls ExternalUrls `json:"external_urls"`
					Href         string       `json:"href"`
					Id           string       `json:"id"`
					Name         string       `json:"name"`
					Uri          string       `json:"uri"`
				} `json:"artists"`
				ExternalUrls         ExternalUrls `json:"external_urls"`
				Href                 string       `json:"href"`
				Id                   string       `json:"id"`
				Images               []Image      `json:"images"`
				Name                 string       `json:"name"`
				ReleaseDate          string       `json:"release_date"`
				ReleaseDatePrecision string       `json:"release_date_precision"`
				TotalTracks          int          `json:"total_tracks"`
				Uri                  string       `json:"uri"`
			} `json:"album"`
			Artists []struct {
				ExternalUrls ExternalUrls `json:"external_urls"`
				Genres       []string     `json:"genres"`
				Href         string       `json:"href"`
				Id           string       `json:"id"`
				Images       []Image      `json:"images"`
				Name         string       `json:"name"`
				Uri          string       `json:"uri"`
			} `json:"artists"`
		} `json:"items"`
	} `json:"tracks"`
}

// https://developer.spotify.com/documentation/web-api/reference/search
func (a *Api) SearchTracks(artist, album, track string, limit int, offset int) (*SearchResponse, *util.RequestError) {
	path := "/search"
	query := fmt.Sprintf("artist:%s track:%s", artist, track)
	if album != "" {
		query = query + fmt.Sprintf(" album:%s", album)
	}
	if limit == 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	params := url.Values{}
	params.Add("q", query)
	params.Add("type", "track")
	params.Add("limit", strconv.Itoa(limit))
	params.Add("offset", strconv.Itoa(offset))
	paramsForCache := a.getParamsStr(params)
	var response SearchResponse

	cacheHit, err := a.loadCachedResponse(path, paramsForCache, a.spotifyUser.Id, &response)
	if err != nil {
		util.LogError("Failed to use search tracks cached response:", err)
		return nil, util.NewRequestError(http.StatusInternalServerError, err)
	}
	if cacheHit {
		return &response, nil
	}

	requestErr := a.get(path, params, &response)
	if requestErr != nil {
		if requestErr.StatusCode != 401 {
			util.LogError("Failed to search Spotify tracks:", requestErr.Err)
			return nil, requestErr
		}

		requestErr = a.refreshSpotifyToken()
		if requestErr != nil {
			return nil, requestErr
		}

		// Try the original request once more, now with an updated access token:
		requestErr = a.get(path, params, &response)
		if requestErr != nil {
			util.LogError("Failed to search Spotify tracks after refreshing token:", requestErr.Err)
			return nil, requestErr
		}
	}

	a.cacheResponse(response, path, paramsForCache, a.spotifyUser.Id)
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

const CheckSavedTracksPath = "/me/tracks/contains"

func (a *Api) checkBatchOfSavedTracks(trackIDs []string) (*CheckSavedTracksResponse, *util.RequestError) {
	if len(trackIDs) > 50 {
		err := fmt.Errorf("cannot check more than 50 track IDs at a time, got %d", len(trackIDs))
		return nil, util.NewRequestError(http.StatusInternalServerError, err)
	}
	params := url.Values{}
	params.Add("ids", strings.Join(trackIDs, ","))
	paramsForCache := a.getParamsStr(params)
	var response []bool

	cacheHit, err := a.loadCachedResponse(CheckSavedTracksPath, paramsForCache, a.spotifyUser.Id, &response)
	if err != nil {
		util.LogError("Failed to use cached response for checking saved Spotify tracks:", err)
		return nil, util.NewRequestError(http.StatusInternalServerError, err)
	}
	if cacheHit {
		result := zipCheckSavedTracksResponse(trackIDs, response)
		return result, nil
	}

	requestErr := a.get(CheckSavedTracksPath, params, &response)
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
		requestErr = a.get(CheckSavedTracksPath, params, &response)
		if requestErr != nil {
			util.LogError("Failed to check Spotify saved tracks after refreshing token:", requestErr.Err)
			return nil, requestErr
		}
	}

	a.cacheResponse(response, CheckSavedTracksPath, paramsForCache, a.spotifyUser.Id)
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
