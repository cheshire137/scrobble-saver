import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type SpotifySavedTracksContextProps = {
  savedTrackIds: Set<string>
  addSavedTracks(trackIds: string[]): void
}

export const SpotifySavedTracksContext = createContext<SpotifySavedTracksContextProps>({
  savedTrackIds: new Set(),
  addSavedTracks: () => {},
})

export const SpotifySavedTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [savedTrackIds, setSavedTrackIds] = useState<Set<string>>(new Set())
  const addSavedTracks = useCallback((trackIds: string[]) => {
    setSavedTrackIds(t => {
      return new Set([...t, ...trackIds])
    })
  }, [setSavedTrackIds])
  const contextProps = useMemo(() => ({
    savedTrackIds,
    addSavedTracks,
  } satisfies SpotifySavedTracksContextProps), [savedTrackIds, addSavedTracks])

  return <SpotifySavedTracksContext.Provider value={contextProps}>{children}</SpotifySavedTracksContext.Provider>
}
