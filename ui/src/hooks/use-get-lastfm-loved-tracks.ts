import { useContext, useState, useEffect } from 'react'
import LastfmApi from '../models/LastfmApi'
import LastfmLovedTracksResults from '../models/LastfmLovedTracksResults'
import { LastfmTrackSourceContext } from '../contexts/LastfmTrackSourceContext'

interface Results {
  results?: LastfmLovedTracksResults;
  fetching: boolean;
  error?: string;
}

function useGetLastfmLovedTracks(page?: number, limit?: number): Results {
  const { isLovedTracks } = useContext(LastfmTrackSourceContext)
  const [results, setResults] = useState<Results>({ fetching: isLovedTracks })
  page ||= 1
  limit ||= 20

  useEffect(() => {
    async function fetchLastfmLovedTracks() {
      try {
        const results = await LastfmApi.getLovedTracks(page, limit)
        setResults({ results, fetching: false })
      } catch (err: any) {
        console.error('failed to fetch Last.fm loved tracks', err)
        setResults({ fetching: false, error: err.message })
      }
    }

    if (isLovedTracks) {
      fetchLastfmLovedTracks()
    } else {
      setResults({ fetching: false })
    }
  }, [isLovedTracks, page, limit])

  return results
}

export default useGetLastfmLovedTracks
