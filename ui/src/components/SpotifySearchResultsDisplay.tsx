import { Box } from '@primer/react'
import SpotifyTrackSearchResults from '../models/SpotifyTrackSearchResults'
import SpotifyTrackSearchResult from './SpotifyTrackSearchResult'

interface Props {
  results: SpotifyTrackSearchResults
}

const SpotifySearchResultDisplay = ({ results: { tracks } }: Props) => {
  if (tracks.length < 1) {
    return <Box>No Spotify tracks found</Box>
  }
  return <Box as="ol">
    {tracks.map(track => <SpotifyTrackSearchResult key={track.id} track={track} />)}
  </Box>
}

export default SpotifySearchResultDisplay
