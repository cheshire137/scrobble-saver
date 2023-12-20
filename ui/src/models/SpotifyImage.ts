class SpotifyImage {
  height: number
  width: number
  url: string

  constructor(data: any) {
    this.height = data.height
    this.width = data.width
    this.url = data.url
  }
}

export default SpotifyImage
