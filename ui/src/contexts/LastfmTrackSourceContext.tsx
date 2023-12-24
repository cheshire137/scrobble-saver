import { createContext, PropsWithChildren, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export type LastfmTrackSourceContextProps = {
  isTopTracks: boolean
  isLovedTracks: boolean
}

export const LastfmTrackSourceContext = createContext<LastfmTrackSourceContextProps>({
  isTopTracks: true,
  isLovedTracks: false,
})

export const LastfmTrackSourceContextProvider = ({ children }: PropsWithChildren) => {
  const [searchParams] = useSearchParams()
  const lastfmSource = searchParams.get('lastfm_source')
  const contextProps = useMemo(() => ({
    isTopTracks: lastfmSource !== 'loved',
    isLovedTracks: lastfmSource === 'loved'
  } satisfies LastfmTrackSourceContextProps), [lastfmSource])

  return <LastfmTrackSourceContext.Provider value={contextProps}>{children}</LastfmTrackSourceContext.Provider>
}
