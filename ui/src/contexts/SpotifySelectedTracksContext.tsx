import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type SpotifySelectedTracksContextProps = {
  selectedTrackIds: string[]
  addSelectedTrackIds(ids: string[]): void
}

export const SpotifySelectedTracksContext = createContext<SpotifySelectedTracksContextProps>({
  selectedTrackIds: [],
  addSelectedTrackIds: () => {},
})

export const SpotifySelectedTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([])
  const addSelectedTrackIds = useCallback((newTrackIds: string[]) => {
    setSelectedTrackIds(t => {
      const existingTrackIds = t.filter(existingTrackId => !newTrackIds.includes(existingTrackId))
      return [...existingTrackIds, ...newTrackIds]
    })
  }, [setSelectedTrackIds])
  const contextProps = useMemo(() => ({
    selectedTrackIds,
    addSelectedTrackIds,
  } satisfies SpotifySelectedTracksContextProps), [selectedTrackIds, addSelectedTrackIds])

  return <SpotifySelectedTracksContext.Provider value={contextProps}>{children}</SpotifySelectedTracksContext.Provider>
}
