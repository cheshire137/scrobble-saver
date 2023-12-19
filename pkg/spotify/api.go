package spotify

import (
	"github.com/cheshire137/lastly-likes/pkg/config"
	"github.com/cheshire137/lastly-likes/pkg/data_store"
)

const ApiUrl = "https://api.spotify.com/v1/"

type Api struct {
	config *config.Config
	ds     *data_store.DataStore
}

func NewApi(config *config.Config, ds *data_store.DataStore) *Api {
	return &Api{config: config, ds: ds}
}
