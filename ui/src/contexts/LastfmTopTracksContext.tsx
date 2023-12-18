import { createContext, PropsWithChildren, useMemo } from 'react'
import useGetLastfmTopTracks from '../hooks/use-get-lastfm-top-tracks'
import { Flash } from '@primer/react'
import LastfmTopTracks from '../models/LastfmTopTracks'

export type LastfmTopTracksContextProps = {
  results?: LastfmTopTracks
}

export const LastfmTopTracksContext = createContext<LastfmTopTracksContextProps>({})

interface Props extends PropsWithChildren {
  user: string,
  period?: string,
  page?: number,
  limit?: number,
}

export const LastfmTopTracksContextProvider = ({ user, page, period, limit, children }: Props) => {
  const { results, fetching, error } = useGetLastfmTopTracks(user, period, page, limit)
  const contextProps = useMemo(() => ({ results } satisfies LastfmTopTracksContextProps), [results])

  if (fetching) return <p>Loading Last.fm top tracks...</p>
  if (error) return <Flash variant="danger">Error loading Last.fm top tracks: {error}</Flash>

  return <LastfmTopTracksContext.Provider value={contextProps}>{children}</LastfmTopTracksContext.Provider>
}
