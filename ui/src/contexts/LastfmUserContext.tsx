import { createContext, PropsWithChildren, useMemo } from 'react'

export type LastfmUserContextProps = {
  user: string
}

export const LastfmUserContext = createContext<LastfmUserContextProps>({ user: '' })

interface Props extends PropsWithChildren {
  user: string,
}

export const LastfmUserContextProvider = ({ user, children }: Props) => {
  const contextProps = useMemo(() => ({ user } satisfies LastfmUserContextProps), [user])
  return <LastfmUserContext.Provider value={contextProps}>{children}</LastfmUserContext.Provider>
}
