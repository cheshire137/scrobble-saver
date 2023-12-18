import LastfmTopTracks from './LastfmTopTracks'

class LastfmApi {
  static apiUrl() {
    const env = import.meta.env
    const port = env.VITE_BACKEND_PORT || 8080
    return `http://localhost:${port}/api/lastfm`
  }

  public static async getTopTracks(user: string, period?: string, page?: number, limit?: number) {
    const params = new URLSearchParams()
    params.append('user', user)
    if (period) params.append('period', period)
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    const result = await this.get(`/top-tracks?${params.toString()}`)
    return new LastfmTopTracks(result)
  }

  static async get(path: string) {
    const response = await fetch(`${this.apiUrl()}${path}`)
    const json = await response.json()
    if (response.status >= 200 && response.status < 300) return json
    let errorMessage = response.statusText
    if (json && json.error) errorMessage += `: ${json.error}`
    throw new Error(errorMessage)
  }
}

export default LastfmApi
