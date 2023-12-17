package server

import (
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/lastfm"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

func (e *Env) LastfmAuthHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	token := r.URL.Query().Get("token")

	api := lastfm.NewApi(e.config)
	sessionResp := api.GetSession(token)

}
