package lastfm

import (
	"crypto/md5"
	"fmt"
	"net/url"
	"sort"
	"strings"

	"github.com/cheshire137/lastly-likes/pkg/config"
)

// https://www.last.fm/api/intro
const ApiUrl = "http://ws.audioscrobbler.com/2.0"

type Api struct {
	config *config.Config
}

func NewApi(config *config.Config) *Api {
	return &Api{config: config}
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
