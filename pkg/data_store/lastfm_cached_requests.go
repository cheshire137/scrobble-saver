package data_store

import "time"

type LastfmCachedRequest struct {
	Timestamp string
	Body      string
	Method    string
	Params    string
}

func NewLastfmCachedRequest(body, method, params string) *LastfmCachedRequest {
	timestamp := time.Now().Format(time.RFC3339)
	return &LastfmCachedRequest{Timestamp: timestamp, Body: body, Method: method, Params: params}
}

func (ds *DataStore) InsertLastfmCachedRequest(lastfmCachedRequest *LastfmCachedRequest) error {
	query := `INSERT INTO lastfm_cached_requests (timestamp, body, method, params) VALUES (?, ?, ?, ?)`
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

func (ds *DataStore) createLastfmCachedRequestsTable() error {
	query := `CREATE TABLE IF NOT EXISTS lastfm_cached_requests (
		timestamp TEXT NOT NULL,
		body TEXT NOT NULL,
		method TEXT NOT NULL,
		params TEXT NOT NULL,
		PRIMARY KEY (timestamp, method, params)
	)`
	return ds.createTable(query)
}
