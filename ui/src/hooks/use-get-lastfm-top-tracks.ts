import { useContext, useState, useEffect } from 'react'
import LastfmApi from '../models/LastfmApi'
import LastfmTopTracksResults from '../models/LastfmTopTracksResults'
import { LastfmTrackSourceContext } from '../contexts/LastfmTrackSourceContext'
import { defaultLastfmTopTrackPeriod } from '../models/LastfmTopTrackPeriod'

interface Results {
  results?: LastfmTopTracksResults;
  fetching: boolean;
  error?: string;
}

function useGetLastfmTopTracks(period?: string, page?: number, limit?: number): Results {
  const { isTopTracks } = useContext(LastfmTrackSourceContext)
  const [results, setResults] = useState<Results>({ fetching: isTopTracks })
  period ||= defaultLastfmTopTrackPeriod
  page ||= 1
  limit ||= 20

  useEffect(() => {
    async function fetchLastfmTopTracks() {
      try {
        const results = await LastfmApi.getTopTracks(period, page, limit)
        setResults({ results, fetching: false })
      } catch (err: any) {
        console.error('failed to fetch Last.fm top tracks', err)
        setResults({ fetching: false, error: err.message })
      }
    }

    if (isTopTracks) {
      fetchLastfmTopTracks()
    } else {
      setResults({ fetching: false })
    }
  }, [isTopTracks, page, limit, period])

  return results
}

export default useGetLastfmTopTracks
