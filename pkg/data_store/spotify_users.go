package data_store

import "github.com/cheshire137/lastly-likes/pkg/util"

type SpotifyUser struct {
	Id           string
	AccessToken  string
	RefreshToken string
	Scopes       string
	ExpiresIn    int
}

func (ds *DataStore) UpsertSpotifyUser(spotifyUser *SpotifyUser) error {
	query := `INSERT INTO spotify_users (id, access_token, refresh_token, scopes, expires_in)
		VALUES (?, ?, ?, ?, ?)
		ON CONFLICT (id) DO UPDATE SET access_token = excluded.access_token, refresh_token = excluded.refresh_token,
		scopes = excluded.scopes, expires_in = excluded.expires_in`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		return err
	}
	encryptedAccessToken, err := util.Encrypt(spotifyUser.AccessToken, ds.secret)
	if err != nil {
		return err
	}
	encryptedRefreshToken, err := util.Encrypt(spotifyUser.RefreshToken, ds.secret)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(spotifyUser.Id, encryptedAccessToken, encryptedRefreshToken, spotifyUser.Scopes,
		spotifyUser.ExpiresIn)
	if err != nil {
		return err
	}
	return nil
}

func (ds *DataStore) createSpotifyUsersTable() error {
	query := `CREATE TABLE IF NOT EXISTS spotify_users (
		id TEXT PRIMARY KEY,
		access_token TEXT NOT NULL,
		refresh_token TEXT NOT NULL,
		scopes TEXT NOT NULL,
		expires_in INTEGER NOT NULL
	)`
	return ds.createTable(query)
}
