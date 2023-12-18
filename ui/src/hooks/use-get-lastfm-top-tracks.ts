import { useState, useEffect } from 'react'
import LastfmApi from '../models/LastfmApi'
import LastfmTopTracks from '../models/LastfmTopTracks'
import LocalStorage from '../models/LocalStorage'

interface Results {
  results?: LastfmTopTracks;
  fetching: boolean;
  error?: string;
}

function useGetLastfmTopTracks(user: string, period?: string, page?: number, limit?: number): Results {
  const [results, setResults] = useState<Results>({ fetching: true })
  const localStorageKey = `lastfm-top-tracks-${user}-${period}-${page}-${limit}`

  useEffect(() => {
    async function fetchLastfmTopTracks() {
      try {
        const localStorageResults = LocalStorage.get(localStorageKey)
        const now = new Date().getTime()
        if (localStorageResults) {
          const { results, timestamp } = localStorageResults
          const diffInMinutes = (now - timestamp) / 60000
          if (diffInMinutes <= 30) {
            console.log('cached Last.fm top tracks are only', Math.round(diffInMinutes), 'minute(s) old, using cache')
            setResults({ results, fetching: false })
            return
          }
        }
        console.log('no recent Last.fm top tracks cache, fetching')
        const results = await LastfmApi.getTopTracks(user, period, page, limit)
        if (results) LocalStorage.set(localStorageKey, { results, timestamp: now })
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
