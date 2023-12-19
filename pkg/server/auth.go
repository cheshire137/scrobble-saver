package server

import (
	"fmt"
	"net/http"
)

const cookieName = "lastly-likes"
const spotifyUserIdKey = "spotifyUserId"
const lastfmUsernameKey = "lastfmUsername"

func (e *Env) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	session, err := e.store.Get(r, cookieName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values[spotifyUserIdKey] = nil
	session.Values[lastfmUsernameKey] = nil
	session.Save(r, w)
	http.Redirect(w, r, fmt.Sprintf("http://localhost:%d", e.config.FrontendPort), http.StatusSeeOther)
}
