import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpotifyApi from '../models/SpotifyApi'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'

interface Results {
  results?: any;
  fetching: boolean;
  error?: string;
}

function useCheckSpotifySavedTracks(spotifyTrackIDs: string[]): Results {
  const canCheck = spotifyTrackIDs.length > 0
  const [results, setResults] = useState<Results>({ fetching: canCheck })
  const { addSavedTracks } = useContext(SpotifySavedTracksContext)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkSavedTracks() {
      try {
        const results = await SpotifyApi.checkSavedTracks(spotifyTrackIDs)
        addSavedTracks(results)
        setResults({ results, fetching: false })
      } catch (err: any) {
        console.error('failed to check saved Spotify tracks', err)
        if (err.name === 'UnauthorizedError') navigate('/')
        setResults({ fetching: false, error: err.message })
      }
    }

    if (canCheck) checkSavedTracks()
  }, [addSavedTracks, spotifyTrackIDs, navigate, canCheck])

  return results
}

export default useCheckSpotifySavedTracks
