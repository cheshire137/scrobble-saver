import { useContext, useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Flash, Spinner } from '@primer/react'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'
import useSaveSpotifyTracks from '../hooks/use-save-spotify-tracks'
import SpotifyLogo from '../assets/Spotify_Icon_RGB_White.png'

function areArraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

const SaveSpotifyTracksButton = () => {
  const [spotifyTrackIdsToSave, setSpotifyTrackIdsToSave] = useState<string[]>([])
  const { selectedTrackIds, deselectTrackIds } = useContext(SpotifySelectedTracksContext)
  const {
    savedTrackIds: preexistingSavedTrackIds,
    notSavedTrackIds,
    addSavedTrackIds,
  } = useContext(SpotifySavedTracksContext)
  const {
    savedTrackIds: justSavedTrackIds,
    saving: savingTracks,
    error: saveTracksError,
  } = useSaveSpotifyTracks(spotifyTrackIdsToSave)
  const notSavedSelectedTrackIds = useMemo(
    () => Array.from(notSavedTrackIds).filter(trackId => selectedTrackIds.has(trackId)),
    [notSavedTrackIds, selectedTrackIds],
  )
  const alreadySavedTrackIds = useMemo(
    () => new Set((justSavedTrackIds ?? []).concat(Array.from(preexistingSavedTrackIds))),
    [preexistingSavedTrackIds, justSavedTrackIds],
  )

  useEffect(() => {
    // Don't try to re-save tracks that are already saved to the Spotify library
    const oldValue = [...spotifyTrackIdsToSave].sort()
    const newValue = spotifyTrackIdsToSave.filter(trackId => !alreadySavedTrackIds.has(trackId)).sort()
    if (!areArraysEqual(oldValue, newValue)) setSpotifyTrackIdsToSave(newValue)
  }, [alreadySavedTrackIds, spotifyTrackIdsToSave])

  useEffect(() => {
    if (justSavedTrackIds) {
      deselectTrackIds(justSavedTrackIds) // Uncheck tracks we just saved to the user's Spotify library
      addSavedTrackIds(justSavedTrackIds) // Mark tracks as saved to change how they're shown
    }
  }, [justSavedTrackIds, deselectTrackIds, addSavedTrackIds])

  if (saveTracksError) return <Flash variant="danger" sx={{ ml: 2 }}>{saveTracksError}</Flash>

  if (savingTracks) return <Spinner sx={{ ml: 2 }} />

  if (notSavedSelectedTrackIds.length < 1) return null

  return <Button
    onClick={() => setSpotifyTrackIdsToSave(notSavedSelectedTrackIds)}
    sx={{
      ml: 2,
      backgroundColor: 'spotify.bg',
      color: 'white',
      ':hover:not([disabled])': { backgroundColor: 'spotify.bgHover' },
    }}
  >
    <Avatar
      sx={{ mr: 2, display: 'inline-block', verticalAlign: 'middle', boxShadow: 'none' }}
      size={20}
      src={SpotifyLogo}
    />
    Add {notSavedSelectedTrackIds.length} to library
  </Button>
}

export default SaveSpotifyTracksButton
