import { useState, useEffect } from 'react'
import SpotifyApi from '../models/SpotifyApi'

interface Results {
  results?: any;
  fetching: boolean;
  error?: string;
}

function useSearchSpotifyTracks(artist: string, track: string, album?: string, offset?: number, limit?: number): Results {
  const canSearch = artist.trim().length > 0 && track.trim().length > 0
  const [results, setResults] = useState<Results>({ fetching: canSearch })

  useEffect(() => {
    async function searchTracks() {
      console.log('searching Spotify for tracks matching artist=', artist, 'track=', track, 'album=', album, 'limit=',
        limit, 'offset=', offset)
      try {
        const results = await SpotifyApi.searchTracks(artist, track, album, limit, offset)
        setResults({ results, fetching: false })
      } catch (err: any) {
        console.error('failed to search Spotify tracks', err)
        setResults({ fetching: false, error: err.message })
      }
    }

    if (canSearch) searchTracks()
  }, [offset, limit, artist, track, album, canSearch])

  return results
}

export default useSearchSpotifyTracks
