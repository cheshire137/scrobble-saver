package data_store

type SpotifyUser struct {
	Email        string
	AccessToken  string
	RefreshToken string
	Scopes       string
	ExpiresIn    int
}

func (ds *DataStore) createSpotifyUsersTable() error {
	query := `CREATE TABLE IF NOT EXISTS spotify_users (
		email TEXT PRIMARY KEY,
		access_token TEXT NOT NULL,
		refresh_token TEXT NOT NULL,
		scopes TEXT NOT NULL,
		expires_in INTEGER NOT NULL
	)`
	return ds.createTable(query)
}
