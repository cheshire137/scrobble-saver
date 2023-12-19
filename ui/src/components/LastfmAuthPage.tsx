import { useContext, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { PageContext } from '../contexts/PageContext'
import { LastfmUserContext } from '../contexts/LastfmUserContext'
import LastfmTopTracks from './LastfmTopTracks'
import SpotifyLoginLink from './SpotifyLoginLink'

const LastfmAuthPage = () => {
  const username = useLoaderData() as string
  const { setPageTitle } = useContext(PageContext)
  const { setUser: setLastfmUser } = useContext(LastfmUserContext)

  useEffect(() => {
    setPageTitle(`Signed in as ${username} on Last.fm`)
    setLastfmUser(username)
  }, [setPageTitle, username, setLastfmUser])

  return <>
    <SpotifyLoginLink />
    <LastfmTopTracks />
  </>
}

export default LastfmAuthPage
