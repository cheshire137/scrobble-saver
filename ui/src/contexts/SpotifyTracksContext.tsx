import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import SpotifyTrack from '../models/SpotifyTrack'

export type SpotifyTracksContextProps = {
  tracks: SpotifyTrack[]
  addTrack(track: SpotifyTrack): void
}

export const SpotifyTracksContext = createContext<SpotifyTracksContextProps>({
  tracks: [],
  addTrack: () => {},
})

export const SpotifyTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const addTrack = useCallback((track: SpotifyTrack) => {
    setTracks(tracks => {
      if (tracks.some(({ id }) => id === track.id)) {
        return tracks
      }
      return [...tracks, track]
    })
  }, [setTracks])
  const contextProps = useMemo(() => ({ tracks, addTrack, } satisfies SpotifyTracksContextProps), [tracks, addTrack])

  return <SpotifyTracksContext.Provider value={contextProps}>{children}</SpotifyTracksContext.Provider>
}
