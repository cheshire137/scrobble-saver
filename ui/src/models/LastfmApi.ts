import Api from './Api'
import LastfmTopTracks from './LastfmTopTracks'

class LastfmApi {
  public static async getTopTracks(user: string, period?: string, page?: number, limit?: number) {
    const params = new URLSearchParams()
    params.append('user', user)
    if (period) params.append('period', period)
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    const result = await Api.get(`/lastfm/top-tracks?${params.toString()}`)
    return new LastfmTopTracks(result)
  }
}

export default LastfmApi
