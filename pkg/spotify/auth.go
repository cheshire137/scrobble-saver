package spotify

import (
	"fmt"
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
	req, err := http.NewRequest(http.MethodPost, "https://accounts.spotify.com/api"+path,
		strings.NewReader(params.Encode()))
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
