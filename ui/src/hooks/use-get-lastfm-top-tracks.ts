import { useState, useEffect } from 'react'
import LastfmApi from '../models/LastfmApi'
import LastfmTopTracks from '../models/LastfmTopTracks'

interface Results {
  results?: LastfmTopTracks;
  fetching: boolean;
  error?: string;
}

function useGetLastfmTopTracks(user: string, period?: string, page?: number, limit?: number): Results {
  const canFetch = user.trim().length > 0
  const [results, setResults] = useState<Results>({ fetching: canFetch })
  period ||= '6month'
  page ||= 1
  limit ||= 20

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

    if (canFetch) fetchLastfmTopTracks()
  }, [page, limit, period, user, canFetch])

  return results
}

export default useGetLastfmTopTracks
