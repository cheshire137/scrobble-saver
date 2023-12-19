import { createContext, PropsWithChildren, useMemo, useState } from 'react'
import LocalStorage, { spotifyUserIdKey } from '../models/LocalStorage'

export type SpotifyUserContextProps = {
  user: string
  setUser: (user: string) => void
}

export const SpotifyUserContext = createContext<SpotifyUserContextProps>({ user: '', setUser: () => {} })

export const SpotifyUserContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(LocalStorage.get(spotifyUserIdKey) ?? '')
  const contextProps = useMemo(() => ({ user, setUser } satisfies SpotifyUserContextProps), [user])
  return <SpotifyUserContext.Provider value={contextProps}>{children}</SpotifyUserContext.Provider>
}
