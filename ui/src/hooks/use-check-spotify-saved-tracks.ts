import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpotifyApi from '../models/SpotifyApi'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'

interface Results {
  results?: Map<string, boolean>;
  fetching: boolean;
  error?: string;
}

function useCheckSpotifySavedTracks(spotifyTrackIds: string[]): Results {
  const { savedStatusByTrackId, addTrackStatuses } = useContext(SpotifySavedTracksContext)
  const spotifyTrackIdsToCheck = spotifyTrackIds.filter(id => !savedStatusByTrackId.has(id))
  const canCheck = spotifyTrackIdsToCheck.length > 0
  const [results, setResults] = useState<Results>({ fetching: canCheck })
  const navigate = useNavigate()

  useEffect(() => {
    async function checkSavedTracks() {
      try {
        const results = await SpotifyApi.checkSavedTracks(spotifyTrackIdsToCheck)
        addTrackStatuses(results)
        setResults({ results, fetching: false })
      } catch (err: any) {
        console.error('failed to check saved Spotify tracks', err)
        if (err.name === 'UnauthorizedError') navigate('/')
        setResults({ fetching: false, error: err.message })
      }
    }

    if (canCheck) checkSavedTracks()
  }, [addTrackStatuses, spotifyTrackIdsToCheck, navigate, canCheck])

  return results
}

export default useCheckSpotifySavedTracks
