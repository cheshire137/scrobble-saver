package data_store

import (
	"encoding/json"
	"time"

	"github.com/cheshire137/scrobble-saver/pkg/util"
)

type SpotifyCachedResponse struct {
	Timestamp string
	Body      string
	Path      string
	Params    string
	UserId    string
}

func NewSpotifyCachedResponse(obj any, path, params, userId string) (*SpotifyCachedResponse, error) {
	body, err := json.Marshal(obj)
	if err != nil {
		return nil, err
	}
	timestamp := time.Now().Format(time.RFC3339)
	spotifyCachedResponse := &SpotifyCachedResponse{Timestamp: timestamp, Body: string(body), Path: path,
		Params: params, UserId: userId}
	return spotifyCachedResponse, nil
}

func (ds *DataStore) LoadCachedSpotifyResponse(path, params, userId string) string {
	cutoffTimestamp := getCacheCutoffTimestamp()
	query := `SELECT body FROM spotify_cached_responses
		WHERE path = ? AND params = ? AND user_id = ? AND timestamp >= ?
		ORDER BY timestamp DESC
		LIMIT 1`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		util.LogError("Failed to prepare statement for loading cached Spotify response:", err)
		return ""
	}
	var body string
	err = stmt.QueryRow(path, params, userId, cutoffTimestamp).Scan(&body)
	if err != nil {
		util.LogError("Failed to load cached Spotify response:", err)
		return ""
	}
	return body
}

func (ds *DataStore) InsertSpotifyCachedResponse(spotifyCachedResponse *SpotifyCachedResponse) error {
	query := `INSERT INTO spotify_cached_responses (timestamp, body, path, params, user_id) VALUES (?, ?, ?, ?, ?)
		ON CONFLICT (path, params, user_id) DO UPDATE SET timestamp = excluded.timestamp, body = excluded.body`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(spotifyCachedResponse.Timestamp, spotifyCachedResponse.Body, spotifyCachedResponse.Path,
		spotifyCachedResponse.Params, spotifyCachedResponse.UserId)
	if err != nil {
		return err
	}
	return nil
}

func (ds *DataStore) TotalExpiredSpotifyCachedResponses() (int, error) {
	cutoffTimestamp := getCacheCutoffTimestamp()
	query := `SELECT COUNT(*) FROM spotify_cached_responses WHERE timestamp < ?`
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

func (ds *DataStore) PruneExpiredSpotifyCachedResponsesIfNecessary() {
	totalExpired, err := ds.TotalExpiredSpotifyCachedResponses()
	if err != nil {
		util.LogError("Error calculating how many cached Spotify responses have expired:", err)
		return
	}
	if totalExpired < 1 {
		util.LogInfo("No cached Spotify responses have expired yet")
		return
	}
	util.LogInfo("Deleting %d expired Spotify cached response(s)...", totalExpired)
	ds.pruneExpiredSpotifyCachedResponses()
}

func (ds *DataStore) ClearCachedResponsesForPath(path, userId string) {
	query := `DELETE FROM spotify_cached_responses WHERE path = ? AND user_id = ?`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		util.LogError("Failed to prepare query to clear cached Spotify responses for path "+path+":", err)
		return
	}
	_, err = stmt.Exec(path, userId)
	if err != nil {
		util.LogError("Failed to clear cached Spotify responses for path "+path+":", err)
		return
	}
	util.LogInfo("Cleared cached " + path + " Spotify responses for user " + userId)
}

func (ds *DataStore) pruneExpiredSpotifyCachedResponses() {
	cutoffTimestamp := getCacheCutoffTimestamp()
	query := `DELETE FROM spotify_cached_responses WHERE timestamp < ?`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		util.LogError("Failed to prepare query to prune expired cached Spotify responses:", err)
		return
	}
	_, err = stmt.Exec(cutoffTimestamp)
	if err != nil {
		util.LogError("Failed to prune expired cached Spotify responses:", err)
		return
	}
}

func (ds *DataStore) createSpotifyCachedResponsesTable() error {
	query := `CREATE TABLE IF NOT EXISTS spotify_cached_responses (
		timestamp TEXT NOT NULL,
		body TEXT NOT NULL,
		path TEXT NOT NULL,
		params TEXT NOT NULL,
		user_id TEXT NOT NULL,
		PRIMARY KEY (path, params, user_id)
	)`
	return ds.createTable(query)
}
