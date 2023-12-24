import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import SpotifyTrack from '../models/SpotifyTrack'

export type SpotifyTracksContextProps = {
  trackIdsByLastfmUrl: Map<string, Set<string>>
  tracks: SpotifyTrack[]
  addTracks(lastfmTrackUrl: string, tracks: SpotifyTrack[]): void
}

export const SpotifyTracksContext = createContext<SpotifyTracksContextProps>({
  trackIdsByLastfmUrl: new Map(),
  tracks: [],
  addTracks: () => {},
})

export const SpotifyTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [trackIdsByLastfmUrl, setTrackIdsByLastfmUrl] = useState<Map<string, Set<string>>>(new Map())
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const addTracks = useCallback((lastfmTrackUrl: string, newTracks: SpotifyTrack[]) => {
    setTrackIdsByLastfmUrl(t => {
      const existingTrackIds = t.get(lastfmTrackUrl) ?? []
      const newTrackIds = newTracks.map(newTrack => newTrack.id)
      return new Map([...t, [lastfmTrackUrl, new Set([...existingTrackIds].concat(newTrackIds))]])
    })
    setTracks(t => {
      const newTrackIds = newTracks.map(newTrack => newTrack.id)
      const existingTracks = t.filter(existingTrack => !newTrackIds.includes(existingTrack.id))
      return [...existingTracks, ...newTracks]
    })
  }, [setTracks])
  const contextProps = useMemo(() => ({
    trackIdsByLastfmUrl,
    tracks,
    addTracks,
  } satisfies SpotifyTracksContextProps), [trackIdsByLastfmUrl, tracks, addTracks])

  return <SpotifyTracksContext.Provider value={contextProps}>{children}</SpotifyTracksContext.Provider>
}
