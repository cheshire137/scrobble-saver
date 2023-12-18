package lastfm

import (
	"encoding/xml"
	"net/url"

	"github.com/cheshire137/lastly-likes/pkg/util"
)

type GetTopTracksResponse struct {
	XMLName  xml.Name `xml:"toptracks"`
	Username string   `xml:"user,attr"`
	Period   string   `xml:"type,attr"`
	Tracks   []struct {
		Rank      string `xml:"rank,attr"`
		Name      string `xml:"name"`
		PlayCount int    `xml:"playcount"`
		Artist    struct {
			Name string `xml:"name"`
			Url  string `xml:"url"`
		} `xml:"artist"`
	} `xml:"track"`
}

// https://www.last.fm/api/show/user.getTopTracks
func (a *Api) GetTopTracks(user string) (*GetTopTracksResponse, error) {
	method := "user.getTopTracks"
	params := url.Values{}
	params.Add("user", user)
	var response GetTopTracksResponse
	err := a.get(method, params, false, &response)
	if err != nil {
		util.LogError("Failed to get user's top tracks:", err)
		return nil, err
	}
	return &response, nil
}
