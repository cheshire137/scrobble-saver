import { createContext, PropsWithChildren, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export const LovedTracksSource = 'loved'

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
    isTopTracks: lastfmSource !== LovedTracksSource,
    isLovedTracks: lastfmSource === LovedTracksSource
  } satisfies LastfmTrackSourceContextProps), [lastfmSource])

  return <LastfmTrackSourceContext.Provider value={contextProps}>{children}</LastfmTrackSourceContext.Provider>
}
