# Lastly Likes

## How to develop

Create a Last.fm API app.

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
npm install
npm run dev
```
