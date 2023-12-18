class LastfmArtist {
  name: string
  url: string

  constructor(data: any) {
    this.name = data.Name
    this.url = data.Url
  }
}

export default LastfmArtist
