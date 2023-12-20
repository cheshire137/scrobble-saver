import SpotifyImage from './SpotifyImage'
import SpotifyArtist from './SpotifyArtist'

class SpotifyAlbum {
  totalTracks: number
  albumType: string
  href: string
  id: string
  name: string
  releaseDate: string
  releaseDatePrecision: string
  uri: string
  artists: SpotifyArtist[]
  images: SpotifyImage[]

  constructor(data: any) {
    this.totalTracks = data.total_tracks
    this.albumType = data.album_type
    this.href = data.href
    this.id = data.id
    this.name = data.name
    this.releaseDate = data.release_date
    this.releaseDatePrecision = data.release_date_precision
    this.uri = data.uri
    this.images = (data.images || []).map((image: any) => new SpotifyImage(image))
    this.artists = (data.artists || []).map((artist: any) => new SpotifyArtist(artist))
  }
}

export default SpotifyAlbum
