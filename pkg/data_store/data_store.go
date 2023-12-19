package data_store

import (
	"database/sql"
	"time"
)

type DataStore struct {
	db     *sql.DB
	secret string
}

func NewDataStore(db *sql.DB, secret string) *DataStore {
	return &DataStore{db: db, secret: secret}
}

func (ds *DataStore) CreateTables() error {
	err := ds.createLastfmUsersTable()
	if err != nil {
		return err
	}
	err = ds.createLastfmCachedResponsesTable()
	if err != nil {
		return err
	}
	err = ds.createSpotifyUsersTable()
	if err != nil {
		return err
	}
	err = ds.createSpotifyCachedResponsesTable()
	if err != nil {
		return err
	}
	return nil
}

func (ds *DataStore) createTable(query string) error {
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		return err
	}
	_, err = stmt.Exec()
	if err != nil {
		return err
	}
	return nil
}

func getCacheCutoffTimestamp() string {
	return time.Now().Add(-time.Hour).Format(time.RFC3339)
}
