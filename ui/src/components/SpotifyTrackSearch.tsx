import { useState } from 'react'
import { Flash, ActionList, Spinner } from '@primer/react'
import { SearchIcon } from '@primer/octicons-react'
import SpotifySearchResultsDisplay from './SpotifySearchResultsDisplay'
import LastfmTrack from '../models/LastfmTrack'
import useSearchSpotifyTracks from '../hooks/use-search-spotify-tracks'
import { TrackContainerActionListItem } from './TrackContainer'

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
  const onClick = searchResults ? undefined : () => setTrackQuery(lastfmTrack.name)

  return <TrackContainerActionListItem onClick={onClick}>
    {searching && <Spinner size="small" />}
    {searchError && <Flash variant="danger">Error searching Spotify: {searchError}</Flash>}
    <ActionList.LeadingVisual>
      <SearchIcon />
    </ActionList.LeadingVisual>
    {searchResults
      ? <SpotifySearchResultsDisplay results={searchResults} />
      : <span>Search Spotify</span>}
  </TrackContainerActionListItem>
}

export default SpotifyTrackSearch
