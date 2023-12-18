package data_store

import "time"

type LastfmCachedRequest struct {
	Timestamp string
	Body      string
	Method    string
	Params    string
	Username  string
}

func NewLastfmCachedRequest(body, method, params, username string) *LastfmCachedRequest {
	timestamp := time.Now().Format(time.RFC3339)
	return &LastfmCachedRequest{Timestamp: timestamp, Body: body, Method: method, Params: params, Username: username}
}

func (ds *DataStore) InsertLastfmCachedRequest(lastfmCachedRequest *LastfmCachedRequest) error {
	query := `INSERT INTO lastfm_cached_requests (timestamp, body, method, params, username) VALUES (?, ?, ?, ?, ?)
		ON CONFLICT (method, params, username) DO UPDATE SET timestamp = excluded.timestamp, body = excluded.body`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(lastfmCachedRequest.Timestamp, lastfmCachedRequest.Body, lastfmCachedRequest.Method,
		lastfmCachedRequest.Params)
	if err != nil {
		return err
	}
	return nil
}

func (ds *DataStore) TotalOldLastfmCachedRequests() (int, error) {
	cutoffTimestamp := getCutoffTimestamp()
	query := `SELECT COUNT(*) FROM lastfm_cached_requests WHERE timestamp < ?`
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

func (ds *DataStore) PruneOldLastfmCachedRequests() error {
	cutoffTimestamp := getCutoffTimestamp()
	query := `DELETE FROM lastfm_cached_requests WHERE timestamp < ?`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(cutoffTimestamp)
	if err != nil {
		return err
	}
	return nil
}

func (ds *DataStore) createLastfmCachedRequestsTable() error {
	query := `CREATE TABLE IF NOT EXISTS lastfm_cached_requests (
		timestamp TEXT NOT NULL,
		body TEXT NOT NULL,
		method TEXT NOT NULL,
		params TEXT NOT NULL,
		username TEXT NOT NULL,
		PRIMARY KEY (method, params, username)
	)`
	return ds.createTable(query)
}

func getCutoffTimestamp() string {
	return time.Now().Add(-time.Hour).Format(time.RFC3339)
}
