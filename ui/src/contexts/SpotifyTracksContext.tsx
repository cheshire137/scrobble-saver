import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import SpotifyTrack from '../models/SpotifyTrack'

export type SpotifyTracksContextProps = {
  trackIdsByLastfmUrl: Record<string, string[]>
  tracks: SpotifyTrack[]
  addTracks(lastfmTrackUrl: string, tracks: SpotifyTrack[]): void
}

export const SpotifyTracksContext = createContext<SpotifyTracksContextProps>({
  trackIdsByLastfmUrl: {},
  tracks: [],
  addTracks: () => {},
})

export const SpotifyTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [trackIdsByLastfmUrl, setTrackIdsByLastfmUrl] = useState<Record<string, string[]>>({})
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const addTracks = useCallback((lastfmTrackUrl: string, newTracks: SpotifyTrack[]) => {
    setTrackIdsByLastfmUrl(t => ({ ...t, [lastfmTrackUrl]: newTracks.map(newTrack => newTrack.id) }))
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
