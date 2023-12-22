import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type SpotifySavedTracksContextProps = {
  savedStatusByTrackId: Map<string, boolean>
  addTrackStatuses(updates: Map<string, boolean>): void
}

export const SpotifySavedTracksContext = createContext<SpotifySavedTracksContextProps>({
  savedStatusByTrackId: new Map(),
  addTrackStatuses: () => {},
})

export const SpotifySavedTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [savedStatusByTrackId, setSavedStatusByTrackId] = useState<Map<string, boolean>>(new Map())
  const addTrackStatuses = useCallback((updates: Map<string, boolean>) => {
    setSavedStatusByTrackId(prev => new Map([...prev, ...updates]))
  }, [setSavedStatusByTrackId])
  const contextProps = useMemo(() => ({
    savedStatusByTrackId,
    addTrackStatuses,
  } satisfies SpotifySavedTracksContextProps), [savedStatusByTrackId, addTrackStatuses])

  return <SpotifySavedTracksContext.Provider value={contextProps}>{children}</SpotifySavedTracksContext.Provider>
}
