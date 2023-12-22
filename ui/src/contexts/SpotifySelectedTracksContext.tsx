import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type SpotifySelectedTracksContextProps = {
  selectedTrackIds: Set<string>
  addSelectedTrackIds(ids: string[]): void
  deselectTrackIds(ids: string[]): void
}

export const SpotifySelectedTracksContext = createContext<SpotifySelectedTracksContextProps>({
  selectedTrackIds: new Set(),
  addSelectedTrackIds: () => {},
  deselectTrackIds: () => {},
})

export const SpotifySelectedTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set())
  const addSelectedTrackIds = useCallback((newTrackIds: string[]) => {
    setSelectedTrackIds(existingTrackIds => {
      return new Set([...existingTrackIds, ...newTrackIds])
    })
  }, [setSelectedTrackIds])
  const deselectTrackIds = useCallback((trackIdsToDeselect: string[]) => {
    setSelectedTrackIds(existingTrackIds => {
      const result = new Set([...existingTrackIds])
      trackIdsToDeselect.forEach(id => result.delete(id))
      return result
    })
  }, [setSelectedTrackIds])
  const contextProps = useMemo(() => ({
    selectedTrackIds,
    addSelectedTrackIds,
    deselectTrackIds,
  } satisfies SpotifySelectedTracksContextProps), [selectedTrackIds, addSelectedTrackIds, deselectTrackIds])

  return <SpotifySelectedTracksContext.Provider value={contextProps}>{children}</SpotifySelectedTracksContext.Provider>
}
