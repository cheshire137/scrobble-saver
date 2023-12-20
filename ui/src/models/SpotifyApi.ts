import Api from './Api'

class SpotifyApi {
  public static async searchTracks(album: string, artist: string, track: string, limit?: number, offset?: number) {
    const params = new URLSearchParams()
    params.append('album', album)
    params.append('artist', artist)
    params.append('track', track)
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())
    const result = await Api.get(`/spotify/search-tracks?${params.toString()}`)
    return result
  }
}

export default SpotifyApi
