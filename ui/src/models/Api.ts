import UnauthorizedError from './UnauthorizedError'

class Api {
  static apiUrl() {
    const env = import.meta.env
    const port = env.VITE_BACKEND_PORT || 8080
    return `http://localhost:${port}/api`
  }

  public static async me() {
    const data = await this.get('/me')
    return { isSignedIntoLastfm: data.isSignedIntoLastfm, isSignedIntoSpotify: data.isSignedIntoSpotify,
      spotifyUserId: data.spotifyUserId, lastfmUsername: data.lastfmUsername }
  }

  static async get(path: string) {
    const response = await fetch(`${this.apiUrl()}${path}`, { credentials: 'include' })
    const json = await response.json()
    if (response.status >= 200 && response.status < 300) return json
    let errorMessage = response.statusText
    if (json && json.error) errorMessage += `: ${json.error}`
    if (response.status === 401) throw new UnauthorizedError(errorMessage)
    throw new Error(errorMessage)
  }

  static async post(path: string) {
    const response = await fetch(`${this.apiUrl()}${path}`, { method: 'POST', credentials: 'include' })
    const json = await response.json()
    if (response.status >= 200 && response.status < 300) return json
    let errorMessage = response.statusText
    if (json && json.error) errorMessage += `: ${json.error}`
    if (response.status === 401) throw new UnauthorizedError(errorMessage)
    throw new Error(errorMessage)
  }
}

export default Api
