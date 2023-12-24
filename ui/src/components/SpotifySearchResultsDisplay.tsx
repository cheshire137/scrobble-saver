import { Flash } from '@primer/react'
import SpotifyTrackSearchResults from '../models/SpotifyTrackSearchResults'

interface Props {
  results: SpotifyTrackSearchResults
}

const SpotifySearchResultDisplay = ({ results: { tracks } }: Props) => {
  if (tracks.length < 1) {
    return <Flash variant="warning">No Spotify tracks found</Flash>
  }
  return <Flash variant="success">Found track on Spotify</Flash>
}

export default SpotifySearchResultDisplay
