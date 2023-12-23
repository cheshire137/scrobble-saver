import { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flash, Spinner } from '@primer/react'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'
import useSaveSpotifyTracks from '../hooks/use-save-spotify-tracks'

function areArraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

const SaveSpotifyTracksButton = () => {
  const [spotifyTrackIdsToSave, setSpotifyTrackIdsToSave] = useState<string[]>([])
  const { selectedTrackIds } = useContext(SpotifySelectedTracksContext)
  const {
    savedTrackIds: preexistingSavedTrackIds,
    notSavedTrackIds,
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
    const oldValue = [...spotifyTrackIdsToSave].sort()
    const newValue = spotifyTrackIdsToSave.filter(trackId => !alreadySavedTrackIds.has(trackId)).sort()
    if (!areArraysEqual(oldValue, newValue)) setSpotifyTrackIdsToSave(newValue)
  }, [alreadySavedTrackIds, spotifyTrackIdsToSave])

  if (saveTracksError) return <Flash variant="danger" sx={{ ml: 2 }}>{saveTracksError}</Flash>

  if (savingTracks) return <Spinner sx={{ ml: 2 }} />

  if (notSavedSelectedTrackIds.length < 1) return null

  return <Button
    variant="primary"
    onClick={() => setSpotifyTrackIdsToSave(notSavedSelectedTrackIds)}
    sx={{ ml: 2 }}
  >Save selected tracks</Button>
}

export default SaveSpotifyTracksButton
