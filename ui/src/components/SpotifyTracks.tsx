import { Fragment, useContext, useEffect, useState } from 'react'
import { SpotifyTracksContext } from '../contexts/SpotifyTracksContext'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import { LastfmLovedTracksContext } from '../contexts/LastfmLovedTracksContext'
import { LastfmTrackSourceContext } from '../contexts/LastfmTrackSourceContext'
import { ActionList, Avatar, Box, Button, Flash, Heading, Spinner } from '@primer/react'
import { SearchIcon } from '@primer/octicons-react'
import SpotifyTrackDisplay from './SpotifyTrackDisplay'
import SpotifyLogo from '../assets/Spotify_Icon_RGB_Green.png'
import SpotifyTrackSearch from './SpotifyTrackSearch'
import useCheckSpotifySavedTracks from '../hooks/use-check-spotify-saved-tracks'
import SaveSpotifyTracksButton from './SaveSpotifyTracksButton'

const SpotifyTracks = () => {
  const [hasUserSelectedAnyTracks, setHasUserSelectedAnyTracks] = useState(false)
  const [preloadAll, setPreloadAll] = useState(false)
  const { tracks: spotifyTracks, trackIdsByLastfmUrl: spotifyTrackIdsByLastfmUrl } = useContext(SpotifyTracksContext)
  const { notSavedTrackIds } = useContext(SpotifySavedTracksContext)
  const { addSelectedTrackIds } = useContext(SpotifySelectedTracksContext)
  const { isLovedTracks } = useContext(LastfmTrackSourceContext)
  const { results: lastfmTopTrackResults } = useContext(LastfmTopTracksContext)
  const { results: lastfmLovedTrackResults } = useContext(LastfmLovedTracksContext)
  const lastfmTrackResults = isLovedTracks ? lastfmLovedTrackResults : lastfmTopTrackResults
  const allLastfmTracksLookedUpOnSpotify = lastfmTrackResults && lastfmTrackResults.tracks.every(lastfmTrack =>
    spotifyTrackIdsByLastfmUrl.has(lastfmTrack.url)
  )
  const spotifyTrackIdsToCheck = allLastfmTracksLookedUpOnSpotify ? spotifyTracks.map(track => track.id) : []
  const {
    fetching: checkingSavedTracks,
    error: checkSavedTracksError
  } = useCheckSpotifySavedTracks(spotifyTrackIdsToCheck)

  useEffect(() => {
    if (!hasUserSelectedAnyTracks && !checkingSavedTracks && !checkSavedTracksError) {
      if (notSavedTrackIds.size > 0) addSelectedTrackIds(Array.from(notSavedTrackIds))
    }
  }, [hasUserSelectedAnyTracks, checkingSavedTracks, checkSavedTracksError, addSelectedTrackIds, notSavedTrackIds])

  if (!lastfmTrackResults || lastfmTrackResults.tracks.length < 1) return null

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
      {checkingSavedTracks && <Spinner sx={{ ml: 2 }} />}
      {checkSavedTracksError && <Flash variant="danger" sx={{ ml: 2 }}>{checkSavedTracksError}</Flash>}
      <SaveSpotifyTracksButton />
    </Heading>
    {allLastfmTracksLookedUpOnSpotify || preloadAll ? (
      <ActionList selectionVariant="multiple">
        {lastfmTrackResults.tracks.map(lastfmTrack => {
          const spotifyTrackIds = spotifyTrackIdsByLastfmUrl.get(lastfmTrack.url) ?? new Set()
          if (spotifyTrackIds.size < 1) {
            return <SpotifyTrackSearch key={lastfmTrack.url} lastfmTrack={lastfmTrack} preload={preloadAll} />
          }
          return <Fragment key={lastfmTrack.url}>
            {Array.from(spotifyTrackIds).map(spotifyTrackId => {
              const spotifyTrack = spotifyTracks.find(track => track.id === spotifyTrackId)
              return spotifyTrack ? <SpotifyTrackDisplay
                key={spotifyTrack.id}
                track={spotifyTrack}
                selectable={allLastfmTracksLookedUpOnSpotify ?? false}
                onSelect={() => setHasUserSelectedAnyTracks(true)}
              /> : null
            })}
          </Fragment>
        })}
      </ActionList>
    ) : (
      <>
        {!preloadAll && !allLastfmTracksLookedUpOnSpotify && <Button
          leadingVisual={SearchIcon}
          onClick={() => setPreloadAll(true)}
          size="large"
          sx={{ mt: 4 }}
        >Look up Last.fm tracks on Spotify</Button>}
      </>
    )}
  </Box>
}

export default SpotifyTracks
