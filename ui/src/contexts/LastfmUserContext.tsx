import { createContext, PropsWithChildren, useMemo, useState } from 'react'

export type LastfmUserContextProps = {
  user: string
  setUser: (user: string) => void
}

export const LastfmUserContext = createContext<LastfmUserContextProps>({ user: '', setUser: () => {} })

export const LastfmUserContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState('')
  const contextProps = useMemo(() => ({ user, setUser } satisfies LastfmUserContextProps), [user])
  return <LastfmUserContext.Provider value={contextProps}>{children}</LastfmUserContext.Provider>
}
