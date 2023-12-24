import { useContext, useState, useEffect } from 'react'
import LastfmApi from '../models/LastfmApi'
import LastfmTopTracks from '../models/LastfmTopTracks'
import { LastfmTrackSourceContext } from '../contexts/LastfmTrackSourceContext'

interface Results {
  results?: LastfmTopTracks;
  fetching: boolean;
  error?: string;
}

function useGetLastfmTopTracks(period?: string, page?: number, limit?: number): Results {
  const { isTopTracks } = useContext(LastfmTrackSourceContext)
  const [results, setResults] = useState<Results>({ fetching: isTopTracks })
  period ||= '6month'
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

    if (isTopTracks) fetchLastfmTopTracks()
  }, [isTopTracks, page, limit, period])

  return results
}

export default useGetLastfmTopTracks
