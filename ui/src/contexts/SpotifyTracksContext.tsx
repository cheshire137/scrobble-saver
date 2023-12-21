import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import SpotifyTrack from '../models/SpotifyTrack'

export type SpotifyTracksContextProps = {
  tracks: SpotifyTrack[]
  addTracks(tracks: SpotifyTrack[]): void
}

export const SpotifyTracksContext = createContext<SpotifyTracksContextProps>({
  tracks: [],
  addTracks: () => {},
})

export const SpotifyTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const addTracks = useCallback((newTracks: SpotifyTrack[]) => {
    setTracks(t => {
      const newTrackIds = newTracks.map(newTrack => newTrack.id)
      const existingTracks = t.filter(existingTrack => !newTrackIds.includes(existingTrack.id))
      return [...existingTracks, ...newTracks]
    })
  }, [setTracks])
  const contextProps = useMemo(() => ({
    tracks,
    addTracks,
  } satisfies SpotifyTracksContextProps), [tracks, addTracks])

  return <SpotifyTracksContext.Provider value={contextProps}>{children}</SpotifyTracksContext.Provider>
}
