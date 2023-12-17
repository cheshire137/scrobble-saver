# Lastly Likes

Uses the [Last.fm API](https://www.last.fm/api) and the Spotify API to like on Spotify your top tracks and loves on Last.fm.

## How to develop

Create a [Last.fm API app](https://www.last.fm/api/account/create).

Backend:

```sh
cp config.yml.example config.yml
```

Add your Last.fm API key and secret to config.yml.

```sh
go run cmd/server/main.go
```

Frontend:

```sh
cd ui
cp .env.example .env
npm install
npm run dev
```
