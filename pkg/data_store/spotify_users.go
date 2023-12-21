package data_store

import (
	"fmt"

	"github.com/cheshire137/lastly-likes/pkg/util"
)

type SpotifyUser struct {
	Id           string
	AccessToken  string
	RefreshToken string
	Scopes       string
	ExpiresIn    int
}

func (ds *DataStore) LoadSpotifyUser(id string) (*SpotifyUser, error) {
	query := `SELECT access_token, refresh_token, scopes, expires_in FROM spotify_users WHERE id = ?`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		return nil, err
	}
	var encryptedAccessToken, encryptedRefreshToken, scopes string
	var expiresIn int
	err = stmt.QueryRow(id).Scan(&encryptedAccessToken, &encryptedRefreshToken, &scopes, &expiresIn)
	if err != nil {
		return nil, err
	}
	accessToken, err := util.Decrypt(encryptedAccessToken, ds.secret)
	if err != nil {
		return nil, err
	}
	refreshToken, err := util.Decrypt(encryptedRefreshToken, ds.secret)
	if err != nil {
		return nil, err
	}
	spotifyUser := &SpotifyUser{Id: id, AccessToken: accessToken, RefreshToken: refreshToken, Scopes: scopes,
		ExpiresIn: expiresIn}
	return spotifyUser, nil
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
	fmt.Println("encrypted refresh token:" + encryptedRefreshToken)
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
