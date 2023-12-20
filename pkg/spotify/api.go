package spotify

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sort"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/config"
	"github.com/cheshire137/lastly-likes/pkg/data_store"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

const ApiUrl = "https://api.spotify.com/v1"

type Api struct {
	config      *config.Config
	ds          *data_store.DataStore
	spotifyUser *data_store.SpotifyUser
}

func NewApi(config *config.Config, ds *data_store.DataStore) *Api {
	return &Api{config: config, ds: ds}
}

func NewAuthenticatedApi(config *config.Config, ds *data_store.DataStore, spotifyUser *data_store.SpotifyUser) *Api {
	return &Api{config: config, ds: ds, spotifyUser: spotifyUser}
}

func (a *Api) get(path string, params url.Values, v any) *RequestError {
	url, err := url.Parse(ApiUrl + path)
	if err != nil {
		return NewRequestError(0, err)
	}
	url.RawQuery = params.Encode()
	req, err := http.NewRequest(http.MethodGet, url.String(), nil)
	if err != nil {
		return NewRequestError(0, err)
	}
	util.LogRequest(req)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", a.spotifyUser.AccessToken))
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		util.LogError("Failed to get %s:", path, err)
		return NewRequestError(0, err)
	}
	return a.handleResponse(resp, path, v)
}

func (a *Api) handleResponse(resp *http.Response, path string, v any) *RequestError {
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		util.LogError("Failed to read %s response body:", path, err)
		return NewRequestError(0, err)
	}
	if resp.StatusCode != http.StatusOK {
		util.LogError("Non-200 response for "+path+":", resp.Status, string(data))
		return NewRequestError(resp.StatusCode, fmt.Errorf("%s %s", resp.Status, path))
	}
	err = json.Unmarshal(data, &v)
	if err != nil {
		util.LogError("Failed to unmarshal %s response:", path, err)
		return NewRequestError(resp.StatusCode, err)
	}
	return nil
}

func (a *Api) getParamsStr(params url.Values) string {
	keys := make([]string, len(params))
	for key := range params {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	keyValuePairs := make([]string, len(params))
	for _, key := range keys {
		value := params.Get(key)
		keyValuePairs = append(keyValuePairs, key+value)
	}
	return strings.Join(keyValuePairs, "")
}

func (a *Api) cacheResponse(response any, path, params, userId string) {
	spotifyCachedResponse, err := data_store.NewSpotifyCachedResponse(response, path, params, userId)
	if err != nil {
		util.LogError("Could not serialize Spotify %s response for caching:", path, err)
	}

	err = a.ds.InsertSpotifyCachedResponse(spotifyCachedResponse)
	if err != nil {
		util.LogError("Could not cache Spotify %s response:", path, err)
	}

	util.LogInfo("Cached Spotify %s response for %s", path, userId)
}

func (a *Api) loadCachedResponse(path, paramsForCache, userId string, response any) (bool, error) {
	cachedResponseBody := a.ds.LoadCachedSpotifyResponse(path, paramsForCache, userId)
	if cachedResponseBody != "" {
		util.LogInfo("Using cached response for path=%s, userId=%s, params=%s", path, userId, paramsForCache)
		err := json.Unmarshal([]byte(cachedResponseBody), &response)
		return true, err // cache hit
	}
	return false, nil // cache miss
}
