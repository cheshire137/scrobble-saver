import { useState } from 'react'
import LastfmTrack from '../models/LastfmTrack'
import { Avatar, Box, IconButton, CounterLabel, Flash, Heading, Link, Spinner } from '@primer/react'
import { SearchIcon } from '@primer/octicons-react'
import useSearchSpotifyTracks from '../hooks/use-search-spotify-tracks'
import SpotifySearchResultsDisplay from './SpotifySearchResultsDisplay'
import TrackContainer from './TrackContainer'

interface Props {
  track: LastfmTrack
}

const LastfmTrackDisplay = ({ track: lastfmTrack }: Props) => {
  const [trackNameQuery, setTrackQuery] = useState('')
  const image = lastfmTrack.images.find(image => image.size === 'medium')
  const {
    results: searchResults,
    fetching: searching,
    error: searchError
  } = useSearchSpotifyTracks(lastfmTrack.url, lastfmTrack.artist.name, trackNameQuery)

  if (searchError) {
    return <TrackContainer>
      <Flash variant="danger">Error searching Spotify: {searchError}</Flash>
    </TrackContainer>
  }

  if (searching) {
    return <TrackContainer>
      <Spinner size="small" />
    </TrackContainer>
  }

  return <TrackContainer sx={{ display: 'flex', alignItems: 'center' }}>
    <Heading as="h3" sx={{ fontSize: 2, display: 'flex', alignItems: 'center' }}>
      {image && <Avatar src={image.url} size={32} sx={{ mr: 2 }} />}
      <CounterLabel sx={{ mr: 1 }}>#{lastfmTrack.rank}</CounterLabel>
      <Link href={lastfmTrack.url} target="_blank">{lastfmTrack.name}</Link>
    </Heading>
    <Box sx={{ ml: 1, color: 'fg.muted' }}>
      by <Link href={lastfmTrack.artist.url} muted target="_blank">{lastfmTrack.artist.name}</Link>
    </Box>
    {searchResults
      ? <SpotifySearchResultsDisplay results={searchResults} />
      : <IconButton
          icon={SearchIcon}
          onClick={() => setTrackQuery(lastfmTrack.name)}
          sx={{ ml: 1 }}
          variant="invisible"
          aria-label="Search Spotify for this track"
        />}
  </TrackContainer>
}

export default LastfmTrackDisplay
