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
	accessToken string
	userId      string
}

func NewApi(config *config.Config, ds *data_store.DataStore) *Api {
	return &Api{config: config, ds: ds}
}

func NewAuthenticatedApi(config *config.Config, ds *data_store.DataStore, accessToken string) *Api {
	return &Api{config: config, ds: ds, accessToken: accessToken}
}

func NewAuthenticatedApiForUser(config *config.Config, ds *data_store.DataStore, accessToken, userId string) *Api {
	return &Api{config: config, ds: ds, accessToken: accessToken, userId: userId}
}

func (a *Api) get(path string, params url.Values, v any) error {
	req, err := http.NewRequest(http.MethodGet, ApiUrl+path, strings.NewReader(params.Encode()))
	if err != nil {
		return err
	}
	util.LogRequest(req)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", a.accessToken))
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		util.LogError("Failed to get %s:", path, err)
		return err
	}
	return a.handleResponse(resp, path, v)
}

func (a *Api) handleResponse(resp *http.Response, path string, v any) error {
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		util.LogError("Failed to read %s response body:", path, err)
		return err
	}
	if resp.StatusCode != http.StatusOK {
		util.LogError("Non-200 response for "+path+":", resp.Status, string(data))
		return fmt.Errorf("%s %s", resp.Status, path)
	}
	err = json.Unmarshal(data, &v)
	if err != nil {
		util.LogError("Failed to unmarshal %s response:", path, err)
		return err
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
