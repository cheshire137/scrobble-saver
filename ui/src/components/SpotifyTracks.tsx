import { Fragment, useContext, useEffect, useState } from 'react'
import { SpotifyTracksContext } from '../contexts/SpotifyTracksContext'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import { LastfmLovedTracksContext } from '../contexts/LastfmLovedTracksContext'
import { LastfmTrackSourceContext } from '../contexts/LastfmTrackSourceContext'
import { ActionList, Box, Button } from '@primer/react'
import { SearchIcon } from '@primer/octicons-react'
import SpotifyTrackDisplay from './SpotifyTrackDisplay'
import SpotifyTrackSearch from './SpotifyTrackSearch'
import useCheckSpotifySavedTracks from '../hooks/use-check-spotify-saved-tracks'
import SpotifyTracksHeader from './SpotifyTracksHeader'

const SpotifyTracks = () => {
  const [hasUserSelectedAnyTracks, setHasUserSelectedAnyTracks] = useState(false)
  const [preloadAll, setPreloadAll] = useState(false)
  const { tracks: spotifyTracks, trackIdsByLastfmUrl: spotifyTrackIdsByLastfmUrl } = useContext(SpotifyTracksContext)
  const { notSavedTrackIds } = useContext(SpotifySavedTracksContext)
  const { addSelectedTrackIds } = useContext(SpotifySelectedTracksContext)
  const { isLovedTracks, lastfmTrackSource } = useContext(LastfmTrackSourceContext)
  const { results: lastfmTopTrackResults, page: lastfmTopTracksPage } = useContext(LastfmTopTracksContext)
  const { results: lastfmLovedTrackResults, page: lastfmLovedTracksPage } = useContext(LastfmLovedTracksContext)
  const lastfmTrackResults = isLovedTracks ? lastfmLovedTrackResults : lastfmTopTrackResults
  const pageOfLastfmResults = isLovedTracks ? lastfmLovedTracksPage : lastfmTopTracksPage
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

  useEffect(() => {
    setPreloadAll(false)
  }, [pageOfLastfmResults, lastfmTrackSource])

  if (!lastfmTrackResults || lastfmTrackResults.tracks.length < 1) return null

  return <Box>
    <SpotifyTracksHeader checkSavedTracksError={checkSavedTracksError} checkingSavedTracks={checkingSavedTracks} />
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
