import LastfmLovedTrack from "./LastfmLovedTrack"

class LastfmLovedTracks {
  limit: number
  page: number
  total: number
  totalPages: number
  tracks: LastfmLovedTrack[]

  constructor(data: any) {
    this.limit = data.Limit
    this.page = data.Page
    this.total = data.Total
    this.totalPages = data.TotalPages
    this.tracks = data.Tracks.map((track: any) => new LastfmLovedTrack(track))
  }
}

export default LastfmLovedTracks
