package spotify

import (
	"fmt"
	"net/url"
	"strconv"

	"github.com/cheshire137/lastly-likes/pkg/data_store"
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
func (a *Api) SearchTracks(artist, album, track string, limit int, offset int) (*SearchResponse, error) {
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
		return nil, err
	}
	if cacheHit {
		return &response, nil
	}

	requestErr := a.get(path, params, &response)
	if requestErr != nil {
		if requestErr.StatusCode != 401 {
			util.LogError("Failed to search Spotify tracks:", requestErr.Err)
			return nil, requestErr.Err
		}

		err = a.refreshSpotifyToken()
		if err != nil {
			return nil, err
		}

		// Try the original request once more, now with an updated access token:
		requestErr = a.get(path, params, &response)
		if requestErr != nil {
			util.LogError("Failed to search Spotify tracks after refreshing token:", requestErr.Err)
			return nil, requestErr.Err
		}
	}

	a.cacheResponse(response, path, paramsForCache, a.spotifyUser.Id)
	return &response, nil
}

func (a *Api) refreshSpotifyToken() error {
	util.LogInfo("Spotify token for " + a.spotifyUser.Id + " expired, refreshing...")
	tokenResp, err := a.RefreshToken(a.spotifyUser.RefreshToken)
	if err != nil {
		util.LogError("Failed to refresh Spotify token:", err)
		return err
	}

	spotifyUser := data_store.SpotifyUser{
		Id:           a.spotifyUser.Id,
		AccessToken:  tokenResp.AccessToken,
		RefreshToken: tokenResp.RefreshToken,
		Scopes:       tokenResp.Scope,
		ExpiresIn:    tokenResp.ExpiresIn,
	}
	err = a.ds.UpsertSpotifyUser(&spotifyUser)
	if err != nil {
		util.LogError("Failed to update Spotify user after refreshing token:", err)
		return err
	}

	a.spotifyUser = &spotifyUser
	return nil
}
