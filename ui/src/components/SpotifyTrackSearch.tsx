import { useEffect, useState } from 'react'
import { ActionList, Spinner, SxProp } from '@primer/react'
import { AlertIcon } from '@primer/octicons-react'
import SpotifySearchResultsDisplay from './SpotifySearchResultsDisplay'
import LastfmTopTrack from '../models/LastfmTopTrack'
import LastfmLovedTrack from '../models/LastfmLovedTrack'
import useSearchSpotifyTracks from '../hooks/use-search-spotify-tracks'
import { TrackContainerActionListItem } from './TrackContainer'

interface Props {
  lastfmTrack: LastfmTopTrack | LastfmLovedTrack
  preload?: boolean
}

const SpotifyTrackSearch = ({ lastfmTrack, preload = false }: Props) => {
  const [trackNameQuery, setTrackQuery] = useState(preload ? lastfmTrack.name : '')
  const {
    results: searchResults,
    fetching: searching,
    error: searchError
  } = useSearchSpotifyTracks(lastfmTrack.url, lastfmTrack.artist.name, trackNameQuery)
  const onClick = searchResults || searchError ? undefined : () => setTrackQuery(lastfmTrack.name)
  const sxProp: SxProp['sx'] = searchError ? { color: 'danger.fg' } : undefined
  const noResults = searchResults && searchResults.tracks.length < 1

  useEffect(() => {
    if (preload && !(searchResults || searchError)) setTrackQuery(lastfmTrack.name)
  }, [preload, lastfmTrack.name, searchResults, searchError])

  return <TrackContainerActionListItem sx={sxProp} disabled={searching || !!searchError || noResults} onClick={onClick}>
    {searching && <Spinner size="small" />}
    {searchError && <span>Error searching Spotify: {searchError}</span>}
    {(searchError || searching) && <ActionList.LeadingVisual sx={sxProp}>
      {searchError && <AlertIcon />}
      {searching && <Spinner size="small" />}
    </ActionList.LeadingVisual>}
    {searchResults
      ? <SpotifySearchResultsDisplay results={searchResults} />
      : searchError ? null : <span>Search Spotify</span>}
  </TrackContainerActionListItem>
}

export default SpotifyTrackSearch
