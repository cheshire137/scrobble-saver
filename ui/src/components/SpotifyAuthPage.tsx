import { useContext, useEffect } from 'react'
import { Box } from '@primer/react'
import { PageContext } from '../contexts/PageContext'
import { AuthContext } from '../contexts/AuthContext'
import { LastfmTopTracksContextProvider } from '../contexts/LastfmTopTracksContext'
import { SpotifyTracksContextProvider } from '../contexts/SpotifyTracksContext'
import { SpotifySavedTracksContextProvider } from '../contexts/SpotifySavedTracksContext'
import { SpotifySelectedTracksContextProvider } from '../contexts/SpotifySelectedTracksContext'
import LastfmTopTracks from './LastfmTopTracks'
import SpotifyTracks from './SpotifyTracks'
import { useSearchParams } from 'react-router-dom'

const SpotifyAuthPage = () => {
  const { setPageTitle } = useContext(PageContext)
  const { lastfmUsername, spotifyUserId } = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const period = searchParams.get('period')

  useEffect(() => {
    if (lastfmUsername === spotifyUserId) {
      setPageTitle(`Signed in as ${spotifyUserId} on Spotify and Last.fm`)
    } else {
      setPageTitle(`Signed in as ${spotifyUserId} on Spotify, ${lastfmUsername} on Last.fm`)
    }
  }, [setPageTitle, spotifyUserId, lastfmUsername])

  return <LastfmTopTracksContextProvider period={period}>
    <SpotifyTracksContextProvider>
      <SpotifySavedTracksContextProvider>
        <SpotifySelectedTracksContextProvider>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: 4 }}>
            <LastfmTopTracks />
            <SpotifyTracks />
          </Box>
        </SpotifySelectedTracksContextProvider>
      </SpotifySavedTracksContextProvider>
    </SpotifyTracksContextProvider>
  </LastfmTopTracksContextProvider>
}

export default SpotifyAuthPage
