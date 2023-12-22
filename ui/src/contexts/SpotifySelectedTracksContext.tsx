import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type SpotifySelectedTracksContextProps = {
  selectedTrackIds: Set<string>
  addSelectedTrackIds(ids: string[]): void
  toggle(id: string): void
}

export const SpotifySelectedTracksContext = createContext<SpotifySelectedTracksContextProps>({
  selectedTrackIds: new Set(),
  addSelectedTrackIds: () => {},
  toggle: () => {},
})

export const SpotifySelectedTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set())
  const addSelectedTrackIds = useCallback((newTrackIds: string[]) => {
    setSelectedTrackIds(existingTrackIds => {
      return new Set([...existingTrackIds, ...newTrackIds])
    })
  }, [setSelectedTrackIds])
  const toggle = useCallback((id: string) => {
    setSelectedTrackIds(existingTrackIds => {
      const result = new Set([...existingTrackIds])
      if (result.has(id)) {
        result.delete(id)
      } else {
        result.add(id)
      }
      return result
    })
  }, [setSelectedTrackIds])
  const contextProps = useMemo(() => ({
    selectedTrackIds,
    addSelectedTrackIds,
    toggle,
  } satisfies SpotifySelectedTracksContextProps), [selectedTrackIds, addSelectedTrackIds, toggle])

  return <SpotifySelectedTracksContext.Provider value={contextProps}>{children}</SpotifySelectedTracksContext.Provider>
}
