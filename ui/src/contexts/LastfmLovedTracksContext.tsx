import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import useGetLastfmLovedTracks from '../hooks/use-get-lastfm-loved-tracks'
import { Flash } from '@primer/react'
import LastfmLovedTracks from '../models/LastfmLovedTracks'

export type LastfmLovedTracksContextProps = {
  results?: LastfmLovedTracks
  page?: number
  limit?: number
  update: (page?: number, limit?: number) => void
}

export const LastfmLovedTracksContext = createContext<LastfmLovedTracksContextProps>({
  page: 1,
  limit: 20,
  update: () => {},
})

interface Props extends PropsWithChildren {
  period?: string | null,
  page?: number | null,
  limit?: number | null,
}

export const LastfmLovedTracksContextProvider = ({ children, ...props }: Props) => {
  const [page, setPage] = useState(props.page ?? 1)
  const [limit, setLimit] = useState(props.limit ?? 10)
  const update = useCallback((page?: number, limit?: number) => {
    if (typeof page === 'number') setPage(page)
    if (typeof limit === 'number') setLimit(limit)
  }, [setPage, setLimit])
  const { results, fetching, error } = useGetLastfmLovedTracks(page, limit)
  const contextProps = useMemo(() => ({
    results,
    page,
    limit,
    update,
  } satisfies LastfmLovedTracksContextProps), [results, page, limit, update])

  if (fetching) return <p>Loading Last.fm loved tracks...</p>
  if (error) return <Flash variant="danger">Error loading Last.fm loved tracks: {error}</Flash>

  return <LastfmLovedTracksContext.Provider value={contextProps}>{children}</LastfmLovedTracksContext.Provider>
}
