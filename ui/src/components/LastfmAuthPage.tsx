import { useContext, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { PageContext } from '../contexts/PageContext'
import { LastfmTopTracksContextProvider } from '../contexts/LastfmTopTracksContext'
import { LastfmUserContext } from '../contexts/LastfmUserContext'
import LastfmTopTracks from './LastfmTopTracks'
import SpotifyLoginLink from './SpotifyLoginLink'

const LastfmAuthPage = () => {
  const username = useLoaderData() as string
  const { setPageTitle } = useContext(PageContext)
  const { setUser } = useContext(LastfmUserContext)

  useEffect(() => {
    setPageTitle(`Signed in as ${username} on Last.fm`)
    setUser(username)
  }, [setPageTitle, username, setUser])

  return <LastfmTopTracksContextProvider>
    <SpotifyLoginLink />
    <LastfmTopTracks />
  </LastfmTopTracksContextProvider>
}

export default LastfmAuthPage
