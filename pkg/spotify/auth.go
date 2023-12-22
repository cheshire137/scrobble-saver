package spotify

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/data_store"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

const AuthApiUrl = "https://accounts.spotify.com/api"
const SpotifyUserIdSessionKey = "spotifyUserId"

type GetTokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
func (a *Api) GetToken(code string) (*GetTokenResponse, *RequestError) {
	path := "/token"
	params := url.Values{}
	params.Add("grant_type", "authorization_code")
	params.Add("code", code)
	params.Add("redirect_uri", fmt.Sprintf("http://localhost:%d/auth/spotify", a.config.ServerPort))
	req, err := http.NewRequest(http.MethodPost, AuthApiUrl+path, strings.NewReader(params.Encode()))
	if err != nil {
		return nil, NewRequestError(http.StatusInternalServerError, err)
	}
	clientIdAndSecret := fmt.Sprintf("%s:%s", a.config.Spotify.ClientId, a.config.Spotify.ClientSecret)
	encodedClientIdAndSecret := util.Encode([]byte(clientIdAndSecret))
	req.Header.Add("Authorization", fmt.Sprintf("Basic %s", encodedClientIdAndSecret))
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	util.LogRequest(req)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, NewRequestError(http.StatusInternalServerError, err)
	}
	var getTokenResp GetTokenResponse
	requestErr := a.handleResponse(resp, path, &getTokenResp)
	if requestErr != nil {
		return nil, requestErr
	}
	fmt.Println("refresh token: " + getTokenResp.RefreshToken)
	return &getTokenResp, nil
}

// https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
func (a *Api) RefreshToken(refreshToken string) (*GetTokenResponse, *RequestError) {
	if refreshToken == "" {
		return nil, NewRequestError(http.StatusInternalServerError, fmt.Errorf("refresh token is empty"))
	}
	path := "/token"
	params := url.Values{}
	params.Add("grant_type", "refresh_token")
	params.Add("refresh_token", refreshToken)
	req, err := http.NewRequest(http.MethodPost, AuthApiUrl+path, strings.NewReader(params.Encode()))
	if err != nil {
		return nil, NewRequestError(http.StatusInternalServerError, err)
	}
	clientIdAndSecret := fmt.Sprintf("%s:%s", a.config.Spotify.ClientId, a.config.Spotify.ClientSecret)
	encodedClientIdAndSecret := util.Encode([]byte(clientIdAndSecret))
	req.Header.Add("Authorization", fmt.Sprintf("Basic %s", encodedClientIdAndSecret))
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	util.LogRequest(req)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, NewRequestError(http.StatusInternalServerError, err)
	}
	var getTokenResp GetTokenResponse
	requestErr := a.handleResponse(resp, path, &getTokenResp)
	if requestErr != nil {
		return nil, requestErr
	}
	fmt.Println("new refresh token: " + getTokenResp.RefreshToken)
	return &getTokenResp, nil
}

func (a *Api) refreshSpotifyToken() *RequestError {
	util.LogInfo("Spotify token for " + a.spotifyUser.Id + " expired, refreshing...")
	tokenResp, requestErr := a.RefreshToken(a.spotifyUser.RefreshToken)
	if requestErr != nil {
		util.LogError("Failed to refresh Spotify token:", requestErr)
		a.session.Values[SpotifyUserIdSessionKey] = nil
		util.LogInfo("Clearing session value for %s", SpotifyUserIdSessionKey)
		a.session.Save(a.r, a.w)
		return requestErr
	}

	fmt.Println("new refresh token:" + tokenResp.RefreshToken)
	spotifyUser := data_store.SpotifyUser{
		Id:           a.spotifyUser.Id,
		AccessToken:  tokenResp.AccessToken,
		RefreshToken: tokenResp.RefreshToken,
		Scopes:       tokenResp.Scope,
		ExpiresIn:    tokenResp.ExpiresIn,
	}
	err := a.ds.UpsertSpotifyUser(&spotifyUser)
	if err != nil {
		util.LogError("Failed to update Spotify user after refreshing token:", err)
		return NewRequestError(http.StatusInternalServerError, err)
	}

	a.spotifyUser = &spotifyUser
	return nil
}
