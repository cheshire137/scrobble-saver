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
	params := url.Values{}
	paramsForCache := a.getParamsStr(params)
	var response GetCurrentUserResponse

	cacheHit, err := a.loadCachedResponse(path, paramsForCache, a.userId, &response)
	if err != nil {
		util.LogError("Failed to use cached Spotify current user response:", err)
		return nil, err
	}
	if cacheHit {
		return &response, nil
	}

	err = a.get(path, params, &response)
	if err != nil {
		util.LogError("Failed to get current Spotify user:", err)
		return nil, err
	}
	userId := response.Id
	a.cacheResponse(response, path, paramsForCache, userId)
	return &response, nil
}
