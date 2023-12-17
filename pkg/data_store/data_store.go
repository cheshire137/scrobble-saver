package data_store

import "database/sql"

type DataStore struct {
	db *sql.DB
}

func NewDataStore(db *sql.DB) *DataStore {
	return &DataStore{db: db}
}

func (ds *DataStore) CreateTables() error {
	err := ds.createLastfmUsersTable()
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
