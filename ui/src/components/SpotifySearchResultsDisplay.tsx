import { Box } from '@primer/react'
import SpotifyTrackSearchResults from '../models/SpotifyTrackSearchResults'
import SpotifyTrackDisplay from './SpotifyTrackDisplay'

interface Props {
  results: SpotifyTrackSearchResults
}

const SpotifySearchResultDisplay = ({ results: { tracks } }: Props) => {
  if (tracks.length < 1) {
    return <Box>No Spotify tracks found</Box>
  }
  return <Box as="ol" sx={{ listStyle: 'none', pl: 0, ml: 3 }}>
    {tracks.map(track => <SpotifyTrackDisplay key={track.id} track={track} />)}
  </Box>
}

export default SpotifySearchResultDisplay
