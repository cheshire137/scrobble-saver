import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpotifyApi from '../models/SpotifyApi'
import SpotifyTrackSearchResults from '../models/SpotifyTrackSearchResults'
import { SpotifyTracksContext } from '../contexts/SpotifyTracksContext'

interface Results {
  results?: SpotifyTrackSearchResults;
  fetching: boolean;
  error?: string;
}

function useSearchSpotifyTracks(lastfmTrackUrl: string, artist: string, track: string, album?: string, offset?: number, limit?: number): Results {
  const canSearch = artist.trim().length > 0 && track.trim().length > 0
  const [results, setResults] = useState<Results>({ fetching: canSearch })
  const { addTracks } = useContext(SpotifyTracksContext)
  const navigate = useNavigate()
  offset = offset ?? 0
  limit = limit ?? 1

  useEffect(() => {
    async function searchTracks() {
      try {
        const results = await SpotifyApi.searchTracks(artist, track, album, limit, offset)
        addTracks(lastfmTrackUrl, results.tracks)
        setResults({ results, fetching: false })
      } catch (err: any) {
        console.error('failed to search Spotify tracks', err)
        if (err.name === 'UnauthorizedError') navigate('/')
        setResults({ fetching: false, error: err.message })
      }
    }

    if (canSearch) searchTracks()
  }, [lastfmTrackUrl, offset, limit, artist, track, album, canSearch, addTracks, navigate])

  return results
}

export default useSearchSpotifyTracks
