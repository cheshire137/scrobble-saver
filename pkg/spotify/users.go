package spotify

import (
	"net/url"

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
func (a *Api) GetCurrentUser() (*GetCurrentUserResponse, error) {
	path := "/me"
	var response GetCurrentUserResponse
	err := a.get(path, url.Values{}, &response)
	if err != nil {
		util.LogError("Failed to get current Spotify user:", err)
		return nil, err
	}
	return &response, nil
}
