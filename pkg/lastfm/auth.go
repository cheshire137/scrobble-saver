package lastfm

import (
	"encoding/xml"
	"net/url"

	"github.com/cheshire137/scrobble-saver/pkg/util"
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
func (a *Api) GetSession(token string) (*GetSessionResponse, *util.RequestError) {
	method := "auth.getSession"
	params := url.Values{}
	params.Add("token", token)
	var response GetSessionResponse
	requestErr := a.get(method, params, true, &response)
	if requestErr != nil {
		util.LogError("Failed to get session:", requestErr)
		return nil, requestErr
	}
	return &response, nil
}
