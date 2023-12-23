package lastfm

import (
	"encoding/xml"
	"net/http"
	"net/url"
	"strconv"

	"github.com/cheshire137/scrobble-saver/pkg/util"
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
func (a *Api) GetTopTracks(period string, limit, page int) (*GetTopTracksResponse, *util.RequestError) {
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
	params.Add("user", a.lastfmUser.Name)
	params.Add("period", period)
	params.Add("limit", strconv.Itoa(limit))
	params.Add("page", strconv.Itoa(page))
	paramsForCache := a.getParamsStr(params)
	var response GetTopTracksResponse

	cacheHit, err := a.loadCachedResponse(method, paramsForCache, &response)
	if err != nil {
		util.LogError("Failed to use top tracks cached response:", err)
		return nil, util.NewRequestError(http.StatusInternalServerError, err)
	}
	if cacheHit {
		return &response, nil
	}

	requestErr := a.get(method, params, false, &response)
	if requestErr != nil {
		util.LogError("Failed to get user's top tracks:", requestErr)
		return nil, requestErr
	}
	a.cacheResponse(response, method, paramsForCache)

	return &response, nil
}
