import { useState, useEffect } from 'react'
import LastfmApi from '../models/LastfmApi'
import LastfmLovedTracks from '../models/LastfmLovedTracks'

interface Results {
  results?: LastfmLovedTracks;
  fetching: boolean;
  error?: string;
}

function useGetLastfmLovedTracks(page?: number, limit?: number): Results {
  const [results, setResults] = useState<Results>({ fetching: true })
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

    fetchLastfmLovedTracks()
  }, [page, limit])

  return results
}

export default useGetLastfmLovedTracks
