package data_store

import (
	"encoding/json"
	"time"

	"github.com/cheshire137/scrobble-saver/pkg/util"
)

type LastfmCachedResponse struct {
	Timestamp string
	Body      string
	Method    string
	Params    string
	Username  string
}

func NewLastfmCachedResponse(obj any, method, params, username string) (*LastfmCachedResponse, error) {
	body, err := json.Marshal(obj)
	if err != nil {
		return nil, err
	}
	timestamp := time.Now().Format(time.RFC3339)
	lastfmCachedResponse := &LastfmCachedResponse{Timestamp: timestamp, Body: string(body), Method: method,
		Params: params, Username: username}
	return lastfmCachedResponse, nil
}

func (ds *DataStore) LoadCachedLastfmResponse(method, params, username string) string {
	cutoffTimestamp := getCacheCutoffTimestamp()
	query := `SELECT body FROM lastfm_cached_responses
		WHERE method = ? AND params = ? AND username = ? AND timestamp >= ?
		ORDER BY timestamp DESC
		LIMIT 1`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		util.LogError("Failed to prepare statement for loading cached Last.fm response:", err)
		return ""
	}
	var body string
	err = stmt.QueryRow(method, params, username, cutoffTimestamp).Scan(&body)
	if err != nil {
		util.LogError("Failed to load cached Last.fm response:", err)
		return ""
	}
	return body
}

func (ds *DataStore) InsertLastfmCachedResponse(lastfmCachedResponse *LastfmCachedResponse) error {
	query := `INSERT INTO lastfm_cached_responses (timestamp, body, method, params, username) VALUES (?, ?, ?, ?, ?)
		ON CONFLICT (method, params, username) DO UPDATE SET timestamp = excluded.timestamp, body = excluded.body`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(lastfmCachedResponse.Timestamp, lastfmCachedResponse.Body, lastfmCachedResponse.Method,
		lastfmCachedResponse.Params, lastfmCachedResponse.Username)
	if err != nil {
		return err
	}
	return nil
}

func (ds *DataStore) TotalExpiredLastfmCachedResponses() (int, error) {
	cutoffTimestamp := getCacheCutoffTimestamp()
	query := `SELECT COUNT(*) FROM lastfm_cached_responses WHERE timestamp < ?`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		return 0, err
	}
	var count int
	err = stmt.QueryRow(cutoffTimestamp).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (ds *DataStore) PruneExpiredLastfmCachedResponsesIfNecessary() {
	totalExpired, err := ds.TotalExpiredLastfmCachedResponses()
	if err != nil {
		util.LogError("Error calculating how many cached Last.fm responses have expired:", err)
		return
	}
	if totalExpired < 1 {
		util.LogInfo("No cached Last.fm responses have expired yet")
		return
	}
	util.LogInfo("Deleting %d expired Last.fm cached response(s)...", totalExpired)
	ds.pruneExpiredLastfmCachedResponses()
}

func (ds *DataStore) pruneExpiredLastfmCachedResponses() {
	cutoffTimestamp := getCacheCutoffTimestamp()
	query := `DELETE FROM lastfm_cached_responses WHERE timestamp < ?`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		util.LogError("Failed to prepare query to prune expired cached Last.fm responses:", err)
		return
	}
	_, err = stmt.Exec(cutoffTimestamp)
	if err != nil {
		util.LogError("Failed to prune expired cached Last.fm responses:", err)
		return
	}
}

func (ds *DataStore) createLastfmCachedResponsesTable() error {
	query := `CREATE TABLE IF NOT EXISTS lastfm_cached_responses (
		timestamp TEXT NOT NULL,
		body TEXT NOT NULL,
		method TEXT NOT NULL,
		params TEXT NOT NULL,
		username TEXT NOT NULL,
		PRIMARY KEY (method, params, username)
	)`
	return ds.createTable(query)
}
