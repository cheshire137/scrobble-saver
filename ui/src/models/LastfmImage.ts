class LastfmImage {
  size: string
  url: string

  constructor(data: any) {
    this.size = data.Size
    this.url = data.Url
  }
}

export default LastfmImage
