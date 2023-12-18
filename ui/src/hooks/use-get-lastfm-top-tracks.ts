import { useState, useEffect } from 'react';
import LastfmApi from '../models/LastfmApi';

interface Results {
  results?: any[];
  fetching: boolean;
  error?: string;
}

function useGetLastfmTopTracks(user: string, period?: string, page?: number, limit?: number): Results {
  const [results, setResults] = useState<Results>({ fetching: true })

  useEffect(() => {
    async function fetchLastfmTopTracks() {
      try {
        const results = await LastfmApi.getTopTracks(user, period, page, limit)
        setResults({ results, fetching: false })
      } catch (err: any) {
        console.error('failed to fetch Last.fm top tracks', err)
        setResults({ fetching: false, error: err.message })
      }
    }

    fetchLastfmTopTracks()
  }, [page, limit, period, user])

  return results
}

export default useGetLastfmTopTracks
