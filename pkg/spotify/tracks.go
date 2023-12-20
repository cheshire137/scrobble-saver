package spotify

import (
	"fmt"
	"net/url"
	"strconv"

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
			Popularity   int          `json:"popularity"`
			PreviewUrl   string       `json:"preview_url"`
			TrackNumber  int          `json:"track_number"`
			Type         string       `json:"type"`
			Uri          string       `json:"uri"`
			Album        struct {
				AlbumType string `json:"album_type"`
				Artists   []struct {
					ExternalUrls ExternalUrls `json:"external_urls"`
					Href         string       `json:"href"`
					Id           string       `json:"id"`
					Name         string       `json:"name"`
					Type         string       `json:"type"`
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
				Type                 string       `json:"type"`
				Uri                  string       `json:"uri"`
			} `json:"album"`
			Artists []struct {
				ExternalUrls ExternalUrls `json:"external_urls"`
				Genres       []string     `json:"genres"`
				Href         string       `json:"href"`
				Id           string       `json:"id"`
				Images       []Image      `json:"images"`
				Name         string       `json:"name"`
				Type         string       `json:"type"`
				Uri          string       `json:"uri"`
				Popularity   int          `json:"popularity"`
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

	cacheHit, err := a.loadCachedResponse(path, paramsForCache, a.userId, &response)
	if err != nil {
		util.LogError("Failed to use search tracks cached response:", err)
		return nil, err
	}
	if cacheHit {
		return &response, nil
	}

	err = a.get(path, params, &response)
	if err != nil {
		util.LogError("Failed to search Spotify tracks:", err)
		return nil, err
	}

	a.cacheResponse(response, path, paramsForCache, a.userId)
	return &response, nil
}
