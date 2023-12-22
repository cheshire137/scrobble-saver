import Api from './Api'
import SpotifyTrackSearchResults from './SpotifyTrackSearchResults'

class SpotifyApi {
  public static async searchTracks(artist: string, track: string, album?: string, limit?: number, offset?: number) {
    const params = new URLSearchParams()
    params.append('artist', artist)
    params.append('track', track)
    if (album && album.trim().length > 0) params.append('album', album.trim())
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())
    const data = await Api.get(`/spotify/search-tracks?${params.toString()}`)
    return new SpotifyTrackSearchResults(data)
  }

  public static async checkSavedTracks(trackIDs: string[]) {
    const params = new URLSearchParams()
    params.append('track_ids', trackIDs.map(id => id.trim()).join(','))
    const data = await Api.get(`/spotify/check-saved-tracks?${params.toString()}`)
    const result = new Map<string, boolean>()
    for (const key of Object.keys(data)) {
      result.set(key, data[key])
    }
    return result
  }
}

export default SpotifyApi
