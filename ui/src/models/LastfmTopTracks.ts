import LastfmTrack from "./LastfmTrack"

class LastfmTopTracks {
  limit: number
  page: number
  total: number
  totalPages: number
  tracks: LastfmTrack[]
  username: string

  constructor(data: any) {
    this.limit = data.Limit
    this.page = data.Page
    this.total = data.Total
    this.totalPages = data.TotalPages
    this.tracks = data.Tracks.map((track: any) => new LastfmTrack(track))
    this.username = data.Username
  }
}

export default LastfmTopTracks
