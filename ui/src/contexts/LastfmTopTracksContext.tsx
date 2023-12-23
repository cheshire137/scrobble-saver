import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import useGetLastfmTopTracks from '../hooks/use-get-lastfm-top-tracks'
import { Flash } from '@primer/react'
import LastfmTopTracks from '../models/LastfmTopTracks'

export type LastfmTopTracksContextProps = {
  results?: LastfmTopTracks
  period?: string
  page?: number
  limit?: number
  update: (page?: number, period?: string, limit?: number) => void
}

export const LastfmTopTracksContext = createContext<LastfmTopTracksContextProps>({
  period: '6month',
  page: 1,
  limit: 20,
  update: () => {},
})

interface Props extends PropsWithChildren {
  period?: string,
  page?: number,
  limit?: number,
}

export const LastfmTopTracksContextProvider = ({ children, ...props }: Props) => {
  const [period, setPeriod] = useState(props.period ?? '3month')
  const [page, setPage] = useState(props.page ?? 1)
  const [limit, setLimit] = useState(props.limit ?? 10)
  const update = useCallback((page?: number, period?: string, limit?: number) => {
    if (typeof page === 'number') setPage(page)
    if (period) setPeriod(period)
    if (typeof limit === 'number') setLimit(limit)
  }, [setPage, setPeriod, setLimit])
  const { results, fetching, error } = useGetLastfmTopTracks(period, page, limit)
  const contextProps = useMemo(() => ({
    results,
    period,
    page,
    limit,
    update,
  } satisfies LastfmTopTracksContextProps), [results, period, page, limit, update])

  if (fetching) return <p>Loading Last.fm top tracks...</p>
  if (error) return <Flash variant="danger">Error loading Last.fm top tracks: {error}</Flash>

  return <LastfmTopTracksContext.Provider value={contextProps}>{children}</LastfmTopTracksContext.Provider>
}
