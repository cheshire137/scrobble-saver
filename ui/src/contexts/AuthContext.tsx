import { createContext, PropsWithChildren, useMemo } from 'react'
import useGetMe from '../hooks/use-get-me'

export type AuthContextProps = {
  lastfmUsername: string
  spotifyUserId: string
  isSignedIntoLastfm: boolean
  isSignedIntoSpotify: boolean
}

export const AuthContext = createContext<AuthContextProps>({
  lastfmUsername: '',
  spotifyUserId: '',
  isSignedIntoLastfm: false,
  isSignedIntoSpotify: false,
})

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const { lastfmUsername, spotifyUserId, isSignedIntoLastfm, isSignedIntoSpotify } = useGetMe()
  const contextProps = useMemo(() => ({
    lastfmUsername,
    spotifyUserId,
    isSignedIntoLastfm,
    isSignedIntoSpotify
  } satisfies AuthContextProps), [lastfmUsername, spotifyUserId, isSignedIntoLastfm, isSignedIntoSpotify])
  return <AuthContext.Provider value={contextProps}>{children}</AuthContext.Provider>
}
