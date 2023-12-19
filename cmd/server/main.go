package main

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "github.com/mattn/go-sqlite3"

	"github.com/cheshire137/lastly-likes/pkg/config"
	"github.com/cheshire137/lastly-likes/pkg/data_store"
	"github.com/cheshire137/lastly-likes/pkg/server"
	"github.com/cheshire137/lastly-likes/pkg/util"
)

const ConfigFilePath = "config.yml"

func main() {
	config, err := config.NewConfig(ConfigFilePath)
	if err != nil {
		util.LogError("Failed to load configuration:", err)
		return
	}

	db, err := sql.Open("sqlite3", config.DatabasePath)
	if err != nil {
		util.LogError("Failed to open database:", err)
		return
	}
	util.LogSuccess("Loaded %s database", config.DatabasePath)
	defer db.Close()

	dataStore := data_store.NewDataStore(db, config.Secret)
	err = dataStore.CreateTables()
	if err != nil {
		util.LogError("Failed to create tables:", err)
		return
	}

	dataStore.PruneExpiredLastfmCachedResponsesIfNecessary()
	mux := http.NewServeMux()
	env := server.NewEnv(dataStore, config)

	// mux.Handle("/", http.HandlerFunc(env.RedirectToFrontendHandler))
	mux.Handle("/auth/lastfm", http.HandlerFunc(env.LastfmAuthHandler))
	mux.Handle("/auth/spotify", http.HandlerFunc(env.SpotifyAuthHandler))
	mux.Handle("/api/me", http.HandlerFunc(env.MeHandler))
	mux.Handle("/api/lastfm/top-tracks", http.HandlerFunc(env.LastfmTopTracksHandler))
	mux.Handle("/logout", http.HandlerFunc(env.LogoutHandler))

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", config.ServerPort),
		Handler: mux,
	}

	util.LogInfo("Starting server at http://localhost:%d", config.ServerPort)
	go func(srv *http.Server) {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			util.LogError("Could not start server:", err)
		}
	}(server)

	stopSignal := make(chan os.Signal, 1)
	signal.Notify(stopSignal, syscall.SIGINT, syscall.SIGTERM)
	<-stopSignal

	shutdownServer(server)
}

func shutdownServer(server *http.Server) {
	util.LogInfo("Stopping server...")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		util.LogError("Could not cleanly stop server:", err)
	}
}
