import LastfmTopTrack from "./LastfmTopTrack"

class LastfmTopTracks {
  limit: number
  page: number
  total: number
  totalPages: number
  tracks: LastfmTopTrack[]
  username: string

  constructor(data: any) {
    this.limit = data.Limit
    this.page = data.Page
    this.total = data.Total
    this.totalPages = data.TotalPages
    this.tracks = data.Tracks.map((track: any) => new LastfmTopTrack(track))
    this.username = data.Username
  }
}

export default LastfmTopTracks
