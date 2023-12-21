import { useContext, useEffect } from 'react'
import { Box } from '@primer/react'
import { PageContext } from '../contexts/PageContext'
import { AuthContext } from '../contexts/AuthContext'
import LastfmTopTracks from './LastfmTopTracks'
import LastfmTopTrackPeriodMenu from './LastfmTopTrackPeriodMenu'
import SpotifyTracks from './SpotifyTracks'

const SpotifyAuthPage = () => {
  const { setPageTitle } = useContext(PageContext)
  const { lastfmUsername, spotifyUserId } = useContext(AuthContext)

  useEffect(() => {
    if (lastfmUsername === spotifyUserId) {
      setPageTitle(`Signed in as ${spotifyUserId} on Spotify and Last.fm`)
    } else {
      setPageTitle(`Signed in as ${spotifyUserId} on Spotify, ${lastfmUsername} on Last.fm`)
    }
  }, [setPageTitle, spotifyUserId, lastfmUsername])

  return <Box>
    <LastfmTopTrackPeriodMenu />
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: 4 }}>
      <LastfmTopTracks />
      <SpotifyTracks />
    </Box>
  </Box>
}

export default SpotifyAuthPage
