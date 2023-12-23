import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type SpotifySavedTracksContextProps = {
  savedStatusByTrackId: Map<string, boolean>
  addTrackStatuses(updates: Map<string, boolean>): void
  addSavedTrackIds(ids: string[]): void
  notSavedTrackIds: Set<string>
  savedTrackIds: Set<string>
}

export const SpotifySavedTracksContext = createContext<SpotifySavedTracksContextProps>({
  savedStatusByTrackId: new Map(),
  addTrackStatuses: () => {},
  addSavedTrackIds: () => {},
  notSavedTrackIds: new Set(),
  savedTrackIds: new Set(),
})

export const SpotifySavedTracksContextProvider = ({ children }: PropsWithChildren) => {
  const [savedStatusByTrackId, setSavedStatusByTrackId] = useState<Map<string, boolean>>(new Map())
  const addTrackStatuses = useCallback((updates: Map<string, boolean>) => {
    setSavedStatusByTrackId(prev => new Map([...prev, ...updates]))
  }, [setSavedStatusByTrackId])
  const addSavedTrackIds = useCallback((trackIds: string[]) => {
    setSavedStatusByTrackId(prev => {
      const result = new Map([...prev])
      trackIds.forEach(id => result.set(id, true))
      return result
    })
  }, [setSavedStatusByTrackId])
  const contextProps = useMemo(() => {
    const trackIds = Array.from(savedStatusByTrackId.keys())
    return {
      savedStatusByTrackId,
      addTrackStatuses,
      addSavedTrackIds,
      notSavedTrackIds: new Set(trackIds.filter(trackId => !savedStatusByTrackId.get(trackId))),
      savedTrackIds: new Set(trackIds.filter(trackId => savedStatusByTrackId.get(trackId))),
    } satisfies SpotifySavedTracksContextProps
  }, [savedStatusByTrackId, addTrackStatuses, addSavedTrackIds])

  return <SpotifySavedTracksContext.Provider value={contextProps}>{children}</SpotifySavedTracksContext.Provider>
}
