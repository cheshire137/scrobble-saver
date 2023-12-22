import { Fragment, useContext, useState } from 'react'
import { SpotifyTracksContext } from '../contexts/SpotifyTracksContext'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import { ActionList, Avatar, Box, Button, Flash, Heading, Spinner } from '@primer/react'
import { SearchIcon } from '@primer/octicons-react'
import SpotifyTrackDisplay from './SpotifyTrackDisplay'
import SpotifyLogo from '../assets/Spotify_Icon_RGB_Green.png'
import SpotifyTrackSearch from './SpotifyTrackSearch'
import useCheckSpotifySavedTracks from '../hooks/use-check-spotify-saved-tracks'

const SpotifyTracks = () => {
  const [preloadAll, setPreloadAll] = useState(false)
  const { tracks: spotifyTracks, trackIdsByLastfmUrl: spotifyTrackIdsByLastfmUrl } = useContext(SpotifyTracksContext)
  const { results: lastfmTopTrackResults } = useContext(LastfmTopTracksContext)
  const allLastfmTracksLookedUpOnSpotify = lastfmTopTrackResults && lastfmTopTrackResults.tracks.every(lastfmTrack =>
    (spotifyTrackIdsByLastfmUrl[lastfmTrack.url] ?? []).length > 0 &&
    spotifyTrackIdsByLastfmUrl[lastfmTrack.url].every(spotifyTrackId => spotifyTracks.some(track => track.id === spotifyTrackId))
  )
  const spotifyTrackIdsToCheck = allLastfmTracksLookedUpOnSpotify ? spotifyTracks.map(track => track.id) : []
  const {
    fetching: checkingSavedTracks,
    error: checkSavedTracksError
  } = useCheckSpotifySavedTracks(spotifyTrackIdsToCheck)

  if (!lastfmTopTrackResults || lastfmTopTrackResults.tracks.length < 1) return null

  return <Box>
    <Heading sx={{ mb: 2, color: 'spotify.fg', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>
        <Avatar
          sx={{ mr: 2, display: 'inline-block', verticalAlign: 'middle', boxShadow: 'none' }}
          size={32}
          src={SpotifyLogo}
        />
        Spotify tracks
      </span>
      {!preloadAll && <Button
        leadingVisual={SearchIcon}
        onClick={() => setPreloadAll(true)}
      >Find all</Button>}
      {checkingSavedTracks && <Spinner sx={{ ml: 2 }} />}
      {checkSavedTracksError && <Flash variant="danger" sx={{ ml: 2 }}>{checkSavedTracksError}</Flash>}
    </Heading>
    <ActionList selectionVariant={allLastfmTracksLookedUpOnSpotify ? 'multiple' : 'single'}>
      {lastfmTopTrackResults.tracks.map(lastfmTrack => {
        const spotifyTrackIds = spotifyTrackIdsByLastfmUrl[lastfmTrack.url] ?? []
        if (spotifyTrackIds.length < 1) {
          return <SpotifyTrackSearch key={lastfmTrack.url} lastfmTrack={lastfmTrack} preload={preloadAll} />
        }
        return <Fragment key={lastfmTrack.url}>
          {spotifyTrackIds.map(spotifyTrackId => {
            const spotifyTrack = spotifyTracks.find(track => track.id === spotifyTrackId)
            return spotifyTrack ? <SpotifyTrackDisplay
              key={spotifyTrack.id}
              track={spotifyTrack}
              asLink={!allLastfmTracksLookedUpOnSpotify}
            /> : null
          })}
        </Fragment>
      })}
    </ActionList>
  </Box>
}

export default SpotifyTracks
