package spotify

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/config"
	"github.com/cheshire137/lastly-likes/pkg/data_store"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

const ApiUrl = "https://api.spotify.com/v1/"

type Api struct {
	config      *config.Config
	ds          *data_store.DataStore
	accessToken string
}

func NewApi(config *config.Config, ds *data_store.DataStore) *Api {
	return &Api{config: config, ds: ds}
}

func NewAuthenticatedApi(config *config.Config, ds *data_store.DataStore, accessToken string) *Api {
	return &Api{config: config, ds: ds, accessToken: accessToken}
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
		util.LogError("Non-200 response for %s:", path, resp.Status, string(data))
		return fmt.Errorf("%s %s", resp.Status, path)
	}
	err = json.Unmarshal(data, &v)
	if err != nil {
		util.LogError("Failed to unmarshal %s response:", path, err)
		return err
	}
	return nil
}
