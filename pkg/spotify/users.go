package spotify

import (
	"net/http"
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
