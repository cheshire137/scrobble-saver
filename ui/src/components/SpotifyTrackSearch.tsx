import { useState } from 'react'
import { Button, Flash, Spinner } from '@primer/react'
import { SearchIcon } from '@primer/octicons-react'
import SpotifySearchResultsDisplay from './SpotifySearchResultsDisplay'
import LastfmTrack from '../models/LastfmTrack'
import useSearchSpotifyTracks from '../hooks/use-search-spotify-tracks'
import TrackContainer from './TrackContainer'

interface Props {
  lastfmTrack: LastfmTrack
}

const SpotifyTrackSearch = ({ lastfmTrack }: Props) => {
  const [trackNameQuery, setTrackQuery] = useState('')
  const {
    results: searchResults,
    fetching: searching,
    error: searchError
  } = useSearchSpotifyTracks(lastfmTrack.url, lastfmTrack.artist.name, trackNameQuery)

  return <TrackContainer>
    {searching && <Spinner size="small" />}
    {searchError && <Flash variant="danger">Error searching Spotify: {searchError}</Flash>}
    {searchResults
      ? <SpotifySearchResultsDisplay results={searchResults} />
      : <Button
          leadingVisual={SearchIcon}
          onClick={() => setTrackQuery(lastfmTrack.name)}
          sx={{ ml: 1 }}
          variant="invisible"
        >Search Spotify</Button>}
  </TrackContainer>
}

export default SpotifyTrackSearch
