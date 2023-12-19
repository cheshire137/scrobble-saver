package spotify

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/util"
)

type GetTokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
func (a *Api) GetToken(code string) (*GetTokenResponse, error) {
	path := "/token"
	params := url.Values{}
	params.Add("grant_type", "authorization_code")
	params.Add("code", code)
	params.Add("redirect_uri", fmt.Sprintf("http://localhost:%d/auth/spotify", a.config.ServerPort))
	req, err := http.NewRequest(http.MethodPost, ApiUrl+path, strings.NewReader(params.Encode()))
	if err != nil {
		return nil, err
	}
	clientIdAndSecret := fmt.Sprintf("%s:%s", a.config.Spotify.ClientId, a.config.Spotify.ClientSecret)
	encodedClientIdAndSecret := util.Encode([]byte(clientIdAndSecret))
	req.Header.Add("Authorization", fmt.Sprintf("Basic %s", encodedClientIdAndSecret))
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	util.LogRequest(req)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	var getTokenResp GetTokenResponse
	err = a.handleResponse(resp, path, &getTokenResp)
	if err != nil {
		return nil, err
	}
	return &getTokenResp, nil
}

func (a *Api) get(path string, params url.Values, v any) error {
	url := fmt.Sprintf("%s%s?%s", ApiUrl, path, params.Encode())
	util.LogInfo("GET %s", url)
	resp, err := http.Get(url)
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
