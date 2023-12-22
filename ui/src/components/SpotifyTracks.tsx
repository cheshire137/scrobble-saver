import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { SpotifyTracksContext } from '../contexts/SpotifyTracksContext'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import { ActionList, Avatar, Box, Button, Flash, Heading, Spinner } from '@primer/react'
import { SearchIcon } from '@primer/octicons-react'
import SpotifyTrackDisplay from './SpotifyTrackDisplay'
import SpotifyLogo from '../assets/Spotify_Icon_RGB_Green.png'
import SpotifyTrackSearch from './SpotifyTrackSearch'
import useCheckSpotifySavedTracks from '../hooks/use-check-spotify-saved-tracks'
import useSaveSpotifyTracks from '../hooks/use-save-spotify-tracks'

const SpotifyTracks = () => {
  const [hasUserSelectedAnyTracks, setHasUserSelectedAnyTracks] = useState(false)
  const [preloadAll, setPreloadAll] = useState(false)
  const [spotifyTrackIdsToSave, setSpotifyTrackIdsToSave] = useState<string[]>([])
  const { tracks: spotifyTracks, trackIdsByLastfmUrl: spotifyTrackIdsByLastfmUrl } = useContext(SpotifyTracksContext)
  const { selectedTrackIds, addSelectedTrackIds } = useContext(SpotifySelectedTracksContext)
  const { results: lastfmTopTrackResults } = useContext(LastfmTopTracksContext)
  const allLastfmTracksLookedUpOnSpotify = lastfmTopTrackResults && lastfmTopTrackResults.tracks.every(lastfmTrack =>
    (spotifyTrackIdsByLastfmUrl[lastfmTrack.url] ?? []).length > 0 &&
    spotifyTrackIdsByLastfmUrl[lastfmTrack.url].every(spotifyTrackId => spotifyTracks.some(track => track.id === spotifyTrackId))
  )
  const spotifyTrackIdsToCheck = allLastfmTracksLookedUpOnSpotify ? spotifyTracks.map(track => track.id) : []
  const {
    results: savedStatusByTrackId,
    fetching: checkingSavedTracks,
    error: checkSavedTracksError
  } = useCheckSpotifySavedTracks(spotifyTrackIdsToCheck)
  const notSavedTrackIds = useMemo(() => savedStatusByTrackId
    ? Array.from(savedStatusByTrackId.keys()).filter(trackId => !savedStatusByTrackId.get(trackId))
    : [], [savedStatusByTrackId])
  const notSavedUnselectedTrackIds = useMemo(
    () => notSavedTrackIds.filter(trackId => !selectedTrackIds.has(trackId)),
    [notSavedTrackIds, selectedTrackIds],
  )
  const notSavedSelectedTrackIds = useMemo(
    () => notSavedTrackIds.filter(trackId => selectedTrackIds.has(trackId)),
    [notSavedTrackIds, selectedTrackIds],
  )
  const { savedTrackIds, saving: savingTracks, error: saveTracksError } = useSaveSpotifyTracks(spotifyTrackIdsToSave)

  useEffect(() => {
    if (!hasUserSelectedAnyTracks && !checkingSavedTracks && !checkSavedTracksError) {
      if (notSavedTrackIds.length > 0) addSelectedTrackIds(notSavedTrackIds)
    }
  }, [hasUserSelectedAnyTracks, checkingSavedTracks, checkSavedTracksError, addSelectedTrackIds, notSavedTrackIds])

  useEffect(() => {
    if (savedTrackIds || savedStatusByTrackId) {
      const alreadySavedTrackIds = new Set(savedTrackIds ?? [])
      if (savedStatusByTrackId) {
        savedStatusByTrackId.forEach((saved, trackId) => {
          if (saved) alreadySavedTrackIds.add(trackId)
        })
      }
      setSpotifyTrackIdsToSave(spotifyTrackIdsToSave.filter(trackId => !alreadySavedTrackIds.has(trackId)))
    }
  }, [savedStatusByTrackId, savedTrackIds, spotifyTrackIdsToSave])

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
      {!preloadAll && !allLastfmTracksLookedUpOnSpotify && <Button
        leadingVisual={SearchIcon}
        onClick={() => setPreloadAll(true)}
      >Find all</Button>}
      {checkingSavedTracks && <Spinner sx={{ ml: 2 }} />}
      {checkSavedTracksError && <Flash variant="danger" sx={{ ml: 2 }}>{checkSavedTracksError}</Flash>}
      {saveTracksError && <Flash variant="danger" sx={{ ml: 2 }}>{saveTracksError}</Flash>}
      {notSavedUnselectedTrackIds.length > 0 && <Button
        onClick={() => addSelectedTrackIds(notSavedUnselectedTrackIds)}
      >Select all unsaved tracks</Button>}
      {notSavedSelectedTrackIds.length > 0 && !savingTracks && <Button
        variant="primary"
        onClick={() => setSpotifyTrackIdsToSave(notSavedSelectedTrackIds)}
      >Save selected tracks</Button>}
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
              onSelect={() => setHasUserSelectedAnyTracks(true)}
            /> : null
          })}
        </Fragment>
      })}
    </ActionList>
  </Box>
}

export default SpotifyTracks
