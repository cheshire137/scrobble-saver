import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpotifyApi from '../models/SpotifyApi'

interface Results {
  savedTrackIds?: string[];
  saving: boolean;
  error?: string;
}

function useSaveSpotifyTracks(trackIds: string[]): Results {
  const canSave = trackIds.length > 0
  const [results, setResults] = useState<Results>({ saving: canSave })
  const navigate = useNavigate()

  useEffect(() => {
    async function saveTracks() {
      try {
        const savedTrackIds = await SpotifyApi.saveTracks(trackIds)
        setResults({ savedTrackIds, saving: false })
      } catch (err: any) {
        console.error('failed to search Spotify tracks', err)
        if (err.name === 'UnauthorizedError') navigate('/')
        setResults({ saving: false, error: err.message })
      }
    }

    if (canSave) saveTracks()
  }, [trackIds, canSave, navigate])

  return results
}

export default useSaveSpotifyTracks
