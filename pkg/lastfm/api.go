package lastfm

import (
	"crypto/md5"
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"sort"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/config"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

// https://www.last.fm/api/intro
const ApiUrl = "http://ws.audioscrobbler.com/2.0"

type Api struct {
	config *config.Config
}

func NewApi(config *config.Config) *Api {
	return &Api{config: config}
}

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
	params.Add("api_key", a.config.Lastfm.ApiKey)
	params.Add("method", method)
	params.Add("token", token)
	params.Add("api_sig", a.getSignature(params))
	url := fmt.Sprintf("%s?%s", ApiUrl, params.Encode())
	resp, err := http.Get(url)
	if err != nil {
		util.LogError("Failed to get session:", err)
		return nil
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		util.LogError("Failed to get session:", resp.Status)
		return nil
	}
	data, err := ioutil.ReadAll(resp.Body)
	fmt.Println(string(data))
	if err != nil {
		util.LogError("Failed to read "+method+" response body:", err)
		return nil
	}
	var sessionResponse GetSessionResponse
	err = xml.Unmarshal(data, &sessionResponse)
	if err != nil {
		util.LogError("Failed to unmarshal "+method+" response:", err)
		return nil
	}
	return &sessionResponse
}

// https://www.last.fm/api/webauth
func (a *Api) getSignature(params url.Values) string {
	keys := make([]string, len(params))
	for key := range params {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	keyValuePairs := make([]string, len(params))
	for _, key := range keys {
		value := params.Get(key)
		keyValuePairs = append(keyValuePairs, key+value)
	}
	keyValuePairsStr := strings.Join(keyValuePairs, "")
	signature := keyValuePairsStr + a.config.Lastfm.Secret
	md5Hash := md5.Sum([]byte(signature))
	return fmt.Sprintf("%x", md5Hash)
}
