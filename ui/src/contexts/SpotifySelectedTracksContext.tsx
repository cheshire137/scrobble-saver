import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type SpotifySelectedTracksContextProps = {
  selectedTrackIds: Set<string>
  addSelectedTrackIds(ids: string[]): void
}

export const SpotifySelectedTracksContext = createContext<SpotifySelectedTracksContextProps>({
  selectedTrackIds: new Set(),
  addSelectedTrackIds: () => {},
})

export const SpotifySelectedTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set())
  const addSelectedTrackIds = useCallback((newTrackIds: string[]) => {
    setSelectedTrackIds(existingTrackIds => {
      return new Set([...existingTrackIds, ...newTrackIds])
    })
  }, [setSelectedTrackIds])
  const contextProps = useMemo(() => ({
    selectedTrackIds,
    addSelectedTrackIds,
  } satisfies SpotifySelectedTracksContextProps), [selectedTrackIds, addSelectedTrackIds])

  return <SpotifySelectedTracksContext.Provider value={contextProps}>{children}</SpotifySelectedTracksContext.Provider>
}
