package server

import (
	"fmt"
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/config"
	"github.com/cheshire137/lastly-likes/pkg/data_store"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

type Env struct {
	ds     *data_store.DataStore
	config *config.Config
}

func NewEnv(ds *data_store.DataStore, config *config.Config) *Env {
	return &Env{ds: ds, config: config}
}

func (e *Env) RedirectToFrontendHandler(w http.ResponseWriter, r *http.Request) {
	util.LogRequest(r)
	frontendUrl := fmt.Sprintf("http://localhost:%d", e.config.FrontendPort)
	util.LogInfo("Redirecting to frontend: %s", frontendUrl)
	http.Redirect(w, r, frontendUrl, http.StatusSeeOther)
}

func (e *Env) enableCors(w *http.ResponseWriter) {
	allowedUrl := fmt.Sprintf("http://localhost:%d", e.config.FrontendPort)
	(*w).Header().Set("Access-Control-Allow-Origin", allowedUrl)
}
