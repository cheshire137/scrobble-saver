package server

import (
	"fmt"
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/config"
	"github.com/cheshire137/lastly-likes/pkg/data_store"
)

type Env struct {
	ds     *data_store.DataStore
	config *config.Config
}

func NewEnv(ds *data_store.DataStore, config *config.Config) *Env {
	return &Env{ds: ds, config: config}
}

func (e *Env) enableCors(w *http.ResponseWriter) {
	allowedUrl := fmt.Sprintf("http://localhost:%d", e.config.FrontendPort)
	(*w).Header().Set("Access-Control-Allow-Origin", allowedUrl)
}
