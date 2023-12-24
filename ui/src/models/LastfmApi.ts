import Api from './Api'
import LastfmTopTracksResults from './LastfmTopTracksResults'
import LastfmLovedTracksResults from './LastfmLovedTracksResults'

class LastfmApi {
  public static async getTopTracks(period?: string, page?: number, limit?: number) {
    const params = new URLSearchParams()
    if (period) params.append('period', period)
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    const data = await Api.get(`/lastfm/top-tracks?${params.toString()}`)
    return new LastfmTopTracksResults(data)
  }

  public static async getLovedTracks(page?: number, limit?: number) {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    const data = await Api.get(`/lastfm/loved-tracks?${params.toString()}`)
    return new LastfmLovedTracksResults(data)
  }
}

export default LastfmApi
