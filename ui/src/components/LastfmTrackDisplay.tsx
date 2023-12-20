import { useState } from 'react'
import LastfmTrack from '../models/LastfmTrack'
import { Avatar, Box, Button, CounterLabel, Flash, Heading, Link, Spinner } from '@primer/react'
import useSearchSpotifyTracks from '../hooks/use-search-spotify-tracks'
import SpotifySearchResultDisplay from './SpotifySearchResultDisplay'

interface Props {
  track: LastfmTrack
}

const LastfmTrackDisplay = ({ track }: Props) => {
  const [trackQuery, setTrackQuery] = useState('')
  const image = track.images.find(image => image.size === 'medium')
  const {
    results: searchResults,
    fetching: searching,
    error: searchError
  } = useSearchSpotifyTracks(track.artist.name, trackQuery)

  if (searchError) {
    return <Box as="li">
      <Flash variant="danger">Error searching Spotify: {searchError}</Flash>
    </Box>
  }

  if (searching) {
    return <Box as="li">
      <Spinner size="small" />
    </Box>
  }

  return <Box as="li" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
    <Heading as="h3" sx={{ fontSize: 2, display: 'flex', alignItems: 'center' }}>
      {image && <Avatar src={image.url} size={32} sx={{ mr: 2 }} />}
      <CounterLabel sx={{ mr: 1 }}>#{track.rank}</CounterLabel>
      <Link href={track.url} target="_blank">{track.name}</Link>
    </Heading>
    <Box sx={{ ml: 1, color: 'fg.muted' }}>
      by <Link href={track.artist.url} muted target="_blank">{track.artist.name}</Link>
    </Box>
    <Box sx={{ ml: 1, color: 'fg.muted' }}>
      &middot;
    </Box>
    <Box sx={{ fontStyle: 'italic', ml: 1, color: 'fg.muted' }}>
      {track.playCount} play{track.playCount === 1 ? '' : 's'}
    </Box>
    {searchResults ? (
      <SpotifySearchResultDisplay results={searchResults} />
    ) : (
      <Button onClick={() => setTrackQuery(track.name)} sx={{ ml: 3 }}>Search Spotify</Button>
    )}
  </Box>
}

export default LastfmTrackDisplay
