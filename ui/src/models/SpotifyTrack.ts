import SpotifyAlbum from './SpotifyAlbum'
import SpotifyArtist from './SpotifyArtist'

class SpotifyTrack {
  discNumber: number
  durationMs: number
  explicit: boolean
  id: string
  href: string
  name: string
  trackNumber: number
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
    this.trackNumber = data.track_number
    this.uri = data.uri
    this.url = data.external_urls.spotify
    this.album = new SpotifyAlbum(data.album)
    this.artists = data.artists.map((artist: any) => new SpotifyArtist(artist))
  }

  mediumAlbumImage() {
    return this.album.mediumImage()
  }

  artistNames() {
    const names = this.artists.map(artist => artist.name)
    if (names.length === 1) return names[0]
    if (names.length === 2) return names.join(' and ')
    const leadingNames = names.slice(0, -2)
    const lastPair = names.slice(-2)
    return leadingNames.join(', ') + ', ' + lastPair.join(', and ')
  }
}

export default SpotifyTrack
