import SpotifyTrack from './SpotifyTrack'

class SpotifyTrackSearchResults {
  total: number
  tracks: SpotifyTrack[]
  href: string

  constructor(data: any) {
    this.total = data.total
    this.tracks = data.items.map((track: any) => new SpotifyTrack(track))
    this.href = data.href
  }
}

export default SpotifyTrackSearchResults
