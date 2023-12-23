import SpotifyImage from './SpotifyImage'

class SpotifyArtist {
  url: string
  genres: string[]
  href: string
  id: string
  name: string
  uri: string
  images: SpotifyImage[]

  constructor(data: any) {
    this.url = data.external_urls.spotify
    this.genres = data.genres || []
    this.href = data.href
    this.id = data.id
    this.name = data.name
    this.uri = data.uri
    this.images = (data.images || []).map((image: any) => new SpotifyImage(image))
  }

  smallImage() {
    return this.images.find(image => image.width < 100)
  }

  mediumImage() {
    return this.images.find(image => image.width < 400)
  }
}

export default SpotifyArtist
