package server

import (
	"fmt"
	"net/http"
)

const cookieName = "lastly-likes"

func (e *Env) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values["authenticated"] = false
	session.Save(r, w)
	http.Redirect(w, r, fmt.Sprintf("http://localhost:%d", e.config.FrontendPort), http.StatusSeeOther)
}
