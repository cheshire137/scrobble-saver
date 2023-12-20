import SpotifyAlbum from './SpotifyAlbum'
import SpotifyArtist from './SpotifyArtist'

class SpotifyTrack {
  discNumber: number
  durationMs: number
  explicit: boolean
  id: string
  href: string
  name: string
  popularity: number
  previewUrl: string
  trackNumber: number
  type: string
  uri: string
  url: string
  album: SpotifyAlbum
  artists: SpotifyArtist[]

  constructor(data: any) {
    this.discNumber = data.disc_number
    this.durationMs = data.duration_ms
    this.explicit = data.explicit
    this.id = data.id
    this.href = data.href
    this.name = data.name
    this.popularity = data.popularity
    this.previewUrl = data.preview_url
    this.trackNumber = data.track_number
    this.type = data.type
    this.uri = data.uri
    this.url = data.external_urls.spotify
    this.album = new SpotifyAlbum(data.album)
    this.artists = data.artists.map((artist: any) => new SpotifyArtist(artist))
  }
}

export default SpotifyTrack
