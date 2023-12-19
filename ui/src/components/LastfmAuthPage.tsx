import { useContext, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { PageContext } from '../contexts/PageContext'
import { LastfmTopTracksContextProvider } from '../contexts/LastfmTopTracksContext'
import { LastfmUserContextProvider } from '../contexts/LastfmUserContext'
import LastfmTopTracks from './LastfmTopTracks'
import SpotifyLoginLink from './SpotifyLoginLink'

const LastfmAuthPage = () => {
  const username = useLoaderData() as string
  const { setPageTitle } = useContext(PageContext)

  useEffect(() => {
    setPageTitle(`Signed in as ${username} on Last.fm`)
  }, [setPageTitle, username])

  return <LastfmUserContextProvider user={username}>
    <LastfmTopTracksContextProvider>
      <SpotifyLoginLink />
      <LastfmTopTracks />
    </LastfmTopTracksContextProvider>
  </LastfmUserContextProvider>
}

export default LastfmAuthPage
