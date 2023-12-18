package lastfm

import (
	"encoding/xml"
	"net/url"

	"github.com/cheshire137/lastly-likes/pkg/util"
)

type GetSessionResponse struct {
	XMLName xml.Name `xml:"lfm"`
	Status  string   `xml:"status,attr"`
	Session struct {
		Name       string `xml:"name"`
		Key        string `xml:"key"`
		Subscriber string `xml:"subscriber"`
	} `xml:"session"`
}

// https://www.last.fm/api/show/auth.getSession
func (a *Api) GetSession(token string) *GetSessionResponse {
	method := "auth.getSession"
	params := url.Values{}
	params.Add("token", token)
	var sessionResponse GetSessionResponse
	err := a.get(method, params, &sessionResponse)
	if err != nil {
		util.LogError("Failed to get session:", err)
		return nil
	}
	return &sessionResponse
}
