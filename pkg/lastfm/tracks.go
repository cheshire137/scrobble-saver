package lastfm

import (
	"encoding/xml"
	"net/url"
	"strconv"

	"github.com/cheshire137/lastly-likes/pkg/util"
)

type GetTopTracksResponse struct {
	XMLName   xml.Name `xml:"lfm"`
	Status    string   `xml:"status,attr"`
	TopTracks struct {
		Username   string `xml:"user,attr"`
		Page       int    `xml:"page,attr"`
		Limit      int    `xml:"perPage,attr"`
		TotalPages int    `xml:"totalPages,attr"`
		Total      int    `xml:"total,attr"`
		Tracks     []struct {
			Rank      string `xml:"rank,attr"`
			Name      string `xml:"name"`
			Duration  int    `xml:"duration"`
			PlayCount int    `xml:"playcount"`
			Url       string `xml:"url"`
			Artist    struct {
				Name string `xml:"name"`
				Url  string `xml:"url"`
			} `xml:"artist"`
			Images []struct {
				Size string `xml:"size,attr"`
				Url  string `xml:",chardata"`
			} `xml:"image"`
		} `xml:"track"`
	} `xml:"toptracks"`
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
	paramsForCache := a.getParamsStr(params)
	var response GetTopTracksResponse

	cacheHit, err := a.loadCachedResponse(method, paramsForCache, user, &response)
	if err != nil {
		util.LogError("Failed to use top tracks cached response:", err)
		return nil, err
	}
	if cacheHit {
		return &response, nil
	}

	err = a.get(method, params, false, &response)
	if err != nil {
		util.LogError("Failed to get user's top tracks:", err)
		return nil, err
	}
	a.cacheResponse(response, method, paramsForCache, user)

	return &response, nil
}
