# Lastly Likes

Uses the [Last.fm API](https://www.last.fm/api) and the Spotify API to like on Spotify your top tracks and loves on Last.fm.

## How to develop

Create a [Last.fm API app](https://www.last.fm/api/account/create). Set `http://localhost:8080/auth/lastfm` as the redirect URL.

Create a [Spotify API app](https://developer.spotify.com/dashboard/create). Set `http://localhost:8080/auth/spotify` as the redirect URL. Select the 'Web API' as the API your app will use.

Backend:

```sh
cp config.yml.example config.yml
```

Add your Last.fm API key and secret to config.yml. Make sure the backend port matches the redirect URLs you set on Spotify and Last.fm. Come up with a new secret, such as from [randomkeygen.com](https://randomkeygen.com/) for "secret" in config.yml.

```sh
go run cmd/server/main.go
```

Frontend:

```sh
cd ui
cp .env.example .env
```

Add your Last.fm API key to .env.

```sh
npm install
npm run dev
```
