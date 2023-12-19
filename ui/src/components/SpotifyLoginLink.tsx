import { Link } from '@primer/react'
import LocalStorage, { spotifyStateKey } from '../models/LocalStorage'

// https://developer.spotify.com/documentation/web-api/concepts/scopes
const spotifyScopes = 'user-library-modify user-read-email'

// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
function getSpotifyAuthUrl() {
  const env = import.meta.env
  const clientId = env.VITE_SPOTIFY_CLIENT_ID
  if (!clientId || clientId.trim().length < 1) {
    console.error('Unknown Spotify client ID')
    return
  }
  const backendPort = env.VITE_BACKEND_PORT || 8080
  const redirectUri = `http://localhost:${backendPort}/auth/spotify`
  const params = new URLSearchParams()
  params.append('scope', spotifyScopes)
  params.append('response_type', 'code')
  params.append('client_id', clientId)
  params.append('redirect_uri', redirectUri)
  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

const SpotifyLoginLink = () => {
  const href = getSpotifyAuthUrl()
  if (!href) return null
  return <Link href={href}>Log in with Spotify</Link>
}

export default SpotifyLoginLink
