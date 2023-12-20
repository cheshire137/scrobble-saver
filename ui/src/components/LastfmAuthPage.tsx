import { useContext, useEffect } from 'react'
import { PageContext } from '../contexts/PageContext'
import { AuthContext } from '../contexts/AuthContext'
import SpotifyLoginLink from './SpotifyLoginLink'

const LastfmAuthPage = () => {
  const { setPageTitle } = useContext(PageContext)
  const { lastfmUsername } = useContext(AuthContext)

  useEffect(() => {
    setPageTitle(`Signed in as ${lastfmUsername} on Last.fm`)
  }, [setPageTitle, lastfmUsername])

  return <SpotifyLoginLink />
}

export default LastfmAuthPage
