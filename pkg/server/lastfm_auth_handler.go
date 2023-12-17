package server

import (
	"fmt"
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/util"
)

func (e *Env) LastfmAuthHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	token := r.URL.Query().Get("token")
	fmt.Println(token)
}
