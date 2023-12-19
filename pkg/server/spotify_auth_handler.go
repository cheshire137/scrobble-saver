package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cheshire137/lastly-likes/pkg/spotify"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

func (e *Env) SpotifyAuthHandler(w http.ResponseWriter, r *http.Request) {
	e.enableCors(&w)
	util.LogRequest(r)
	error := r.URL.Query().Get("error")
	if error != "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to sign in with Spotify: " + error
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	code := r.URL.Query().Get("code")
	fmt.Println("code", code)
	api := spotify.NewApi(e.config, e.ds)

	tokenResp, err := api.GetToken(code)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		message := "Failed to sign in with Spotify: " + err.Error()
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tokenResp)
}
