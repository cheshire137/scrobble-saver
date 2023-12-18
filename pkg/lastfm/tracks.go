package lastfm

import (
	"encoding/xml"
	"net/url"
	"strconv"

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
func (a *Api) GetTopTracks(user string, period string, limit int, page int) (*GetTopTracksResponse, error) {
	if period == "" {
		period = "3month"
	}
	if limit < 1 {
		limit = 50
	}
	if page < 1 {
		page = 1
	}
	method := "user.getTopTracks"
	params := url.Values{}
	params.Add("user", user)
	params.Add("period", period)
	params.Add("limit", strconv.Itoa(limit))
	params.Add("page", strconv.Itoa(page))
	var response GetTopTracksResponse
	err := a.get(method, params, false, &response)
	if err != nil {
		util.LogError("Failed to get user's top tracks:", err)
		return nil, err
	}
	return &response, nil
}
