import LastfmArtist from "./LastfmArtist"
import LastfmImage from "./LastfmImage"

class LastfmTrack {
  name: string
  url: string
  rank: string
  playCount: number
  duration: number
  artist: LastfmArtist
  images: LastfmImage[]

  constructor(data: any) {
    this.name = data.Name
    this.url = data.Url
    this.rank = data.Rank
    this.playCount = data.PlayCount
    this.duration = data.Duration
    this.artist = new LastfmArtist(data.Artist)
    this.images = data.Images.map((image: any) => new LastfmImage(image))
  }
}

export default LastfmTrack
