import { useContext, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Box } from '@primer/react'
import { PageContext } from '../contexts/PageContext'
import { LastfmUserContext } from '../contexts/LastfmUserContext'

const SpotifyAuthPage = () => {
  const spotifyUserId = useLoaderData() as string
  const { setPageTitle } = useContext(PageContext)
  const { user: lastfmUser } = useContext(LastfmUserContext)

  useEffect(() => {
    setPageTitle(`Signed in as ${spotifyUserId} on Spotify, ${lastfmUser} on Last.fm`)
  }, [setPageTitle, spotifyUserId, lastfmUser])

  return <Box>
    Signed in with Spotify
  </Box>
}

export default SpotifyAuthPage
