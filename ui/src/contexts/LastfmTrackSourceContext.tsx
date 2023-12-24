import { createContext, PropsWithChildren, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export const TopTracksSource = 'top'
export const LovedTracksSource = 'loved'

export type LastfmTrackSourceContextProps = {
  isTopTracks: boolean
  isLovedTracks: boolean
  lastfmTrackSource: string
}

export const LastfmTrackSourceContext = createContext<LastfmTrackSourceContextProps>({
  isTopTracks: true,
  isLovedTracks: false,
  lastfmTrackSource: TopTracksSource,
})

export const LastfmTrackSourceContextProvider = ({ children }: PropsWithChildren) => {
  const [searchParams] = useSearchParams()
  const lastfmSource = searchParams.get('lastfm_source')
  const contextProps = useMemo(() => ({
    isTopTracks: lastfmSource !== LovedTracksSource,
    isLovedTracks: lastfmSource === LovedTracksSource,
    lastfmTrackSource: lastfmSource == 'loved' ? LovedTracksSource : TopTracksSource,
  } satisfies LastfmTrackSourceContextProps), [lastfmSource])

  return <LastfmTrackSourceContext.Provider value={contextProps}>{children}</LastfmTrackSourceContext.Provider>
}
