package lastfm

import (
	"crypto/md5"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sort"
	"strings"

	"github.com/cheshire137/scrobble-saver/pkg/config"
	"github.com/cheshire137/scrobble-saver/pkg/data_store"
	"github.com/cheshire137/scrobble-saver/pkg/util"
)

// https://www.last.fm/api/intro
const ApiUrl = "http://ws.audioscrobbler.com/2.0"

type Api struct {
	config *config.Config
	ds     *data_store.DataStore
}

func NewApi(config *config.Config, ds *data_store.DataStore) *Api {
	return &Api{config: config, ds: ds}
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

// https://www.last.fm/api/webauth
func (a *Api) getSignature(keyValuePairsStr string) string {
	signature := keyValuePairsStr + a.config.Lastfm.Secret
	md5Hash := md5.Sum([]byte(signature))
	return fmt.Sprintf("%x", md5Hash)
}

func (a *Api) get(method string, params url.Values, signed bool, v any) *util.RequestError {
	params.Add("api_key", a.config.Lastfm.ApiKey)
	params.Add("method", method)
	keyValuePairsStr := a.getParamsStr(params)
	if signed {
		params.Add("api_sig", a.getSignature(keyValuePairsStr))
	}
	url := fmt.Sprintf("%s?%s", ApiUrl, params.Encode())
	util.LogInfo("GET %s", url)
	resp, err := http.Get(url)
	if err != nil {
		util.LogError("Failed to get %s:", method, err)
		return util.NewRequestError(http.StatusInternalServerError, err)
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		util.LogError("Failed to read %s response body:", method, err)
		return util.NewRequestError(http.StatusInternalServerError, err)
	}
	if resp.StatusCode != http.StatusOK {
		util.LogError("Non-200 response for "+method+":", resp.Status, string(data))
		return util.NewRequestError(resp.StatusCode, fmt.Errorf("%s %s", resp.Status, method))
	}
	err = xml.Unmarshal(data, &v)
	if err != nil {
		util.LogError("Failed to unmarshal %s response:", method, err)
		return util.NewRequestError(http.StatusInternalServerError, err)
	}
	return nil
}

func (a *Api) cacheResponse(response any, method string, params string, user string) {
	lastfmCachedResponse, err := data_store.NewLastfmCachedResponse(response, method, params, user)
	if err != nil {
		util.LogError("Could not serialize Last.fm %s response for caching:", method, err)
	}

	err = a.ds.InsertLastfmCachedResponse(lastfmCachedResponse)
	if err != nil {
		util.LogError("Could not cache Last.fm %s response:", method, err)
	}

	util.LogInfo("Cached Last.fm %s response for %s", method, user)
}

func (a *Api) loadCachedResponse(method, paramsForCache, user string, response any) (bool, error) {
	cachedResponseBody := a.ds.LoadCachedLastfmResponse(method, paramsForCache, user)
	if cachedResponseBody != "" {
		util.LogInfo("Using cached response for method=%s, user=%s, params=%s", method, user, paramsForCache)
		err := json.Unmarshal([]byte(cachedResponseBody), &response)
		return true, err // cache hit
	}
	return false, nil // cache miss
}
