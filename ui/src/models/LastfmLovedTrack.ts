import LastfmArtist from "./LastfmArtist"
import LastfmImage from "./LastfmImage"

class LastfmLovedTrack {
  name: string
  url: string
  artist: LastfmArtist
  images: LastfmImage[]

  constructor(data: any) {
    this.name = data.Name
    this.url = data.Url
    this.artist = new LastfmArtist(data.Artist)
    this.images = data.Images.map((image: any) => new LastfmImage(image))
  }

  mediumImage() {
    return this.images.find(image => image.size === 'medium')
  }
}

export default LastfmLovedTrack
