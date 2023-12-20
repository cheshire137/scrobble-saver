import SpotifyImage from './SpotifyImage'

class SpotifyArtist {
  url: string
  genres: string[]
  href: string
  id: string
  name: string
  popularity: number
  type: string
  uri: string
  images: SpotifyImage[]

  constructor(data: any) {
    this.url = data.external_urls.spotify
    this.genres = data.genres || []
    this.href = data.href
    this.id = data.id
    this.name = data.name
    this.popularity = data.popularity
    this.type = data.type
    this.uri = data.uri
    this.images = (data.images || []).map((image: any) => new SpotifyImage(image))
  }
}

export default SpotifyArtist
