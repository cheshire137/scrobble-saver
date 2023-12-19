package spotify

import (
	"github.com/cheshire137/lastly-likes/pkg/config"
	"github.com/cheshire137/lastly-likes/pkg/data_store"
)

const ApiUrl = "https://accounts.spotify.com/api"

type Api struct {
	config *config.Config
	ds     *data_store.DataStore
}

func NewApi(config *config.Config, ds *data_store.DataStore) *Api {
	return &Api{config: config, ds: ds}
}
