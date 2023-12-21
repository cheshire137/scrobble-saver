import { useContext, useState, useEffect } from 'react'
import SpotifyApi from '../models/SpotifyApi'
import SpotifyTrackSearchResults from '../models/SpotifyTrackSearchResults'
import { SpotifyTracksContext } from '../contexts/SpotifyTracksContext'

interface Results {
  results?: SpotifyTrackSearchResults;
  fetching: boolean;
  error?: string;
}

function useSearchSpotifyTracks(artist: string, track: string, album?: string, offset?: number, limit?: number): Results {
  const canSearch = artist.trim().length > 0 && track.trim().length > 0
  const [results, setResults] = useState<Results>({ fetching: canSearch })
  const { addTracks } = useContext(SpotifyTracksContext)
  offset = offset ?? 0
  limit = limit ?? 1

  useEffect(() => {
    async function searchTracks() {
      try {
        const results = await SpotifyApi.searchTracks(artist, track, album, limit, offset)
        addTracks(results.tracks)
        setResults({ results, fetching: false })
      } catch (err: any) {
        console.error('failed to search Spotify tracks', err)
        setResults({ fetching: false, error: err.message })
      }
    }

    if (canSearch) searchTracks()
  }, [offset, limit, artist, track, album, canSearch, addTracks])

  return results
}

export default useSearchSpotifyTracks
