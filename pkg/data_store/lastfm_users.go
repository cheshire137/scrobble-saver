package data_store

import "github.com/cheshire137/lastly-likes/pkg/util"

type LastfmUser struct {
	Name       string
	SessionKey string
}

func (ds *DataStore) UpsertLastfmUser(lastfmUser *LastfmUser) error {
	query := `INSERT INTO lastfm_users (name, session_key) VALUES (?, ?)
		ON CONFLICT (name) DO UPDATE SET session_key = excluded.session_key`
	stmt, err := ds.db.Prepare(query)
	if err != nil {
		return err
	}
	encodedSessionKey, err := util.Encrypt(lastfmUser.SessionKey, ds.secret)
	util.LogInfo("%s => %s", lastfmUser.SessionKey, encodedSessionKey)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(lastfmUser.Name, encodedSessionKey)
	if err != nil {
		return err
	}
	return nil
}

func (ds *DataStore) createLastfmUsersTable() error {
	query := `CREATE TABLE IF NOT EXISTS lastfm_users (
		name TEXT PRIMARY KEY,
		session_key TEXT NOT NULL
	)`
	return ds.createTable(query)
}
