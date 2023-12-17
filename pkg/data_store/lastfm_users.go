package data_store

func (ds *DataStore) createLastfmUsersTable() error {
	query := `CREATE TABLE IF NOT EXISTS lastfm_users (
		name TEXT PRIMARY KEY,
		session_key TEXT NOT NULL
	)`
	return ds.createTable(query)
}
