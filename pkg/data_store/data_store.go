package data_store

import "database/sql"

type DataStore struct {
	db *sql.DB
}

func NewDataStore(db *sql.DB) *DataStore {
	return &DataStore{db: db}
}

func (ds *DataStore) CreateTables() error {
	return nil
}
