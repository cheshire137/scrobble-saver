import { useContext, useEffect } from 'react'
import { PageContext } from '../contexts/PageContext'
import { AuthContext } from '../contexts/AuthContext'
import { LastfmTopTracksContextProvider } from '../contexts/LastfmTopTracksContext'
import { LastfmLovedTracksContextProvider } from '../contexts/LastfmLovedTracksContext'
import { LastfmTrackSourceContextProvider } from '../contexts/LastfmTrackSourceContext'
import { SpotifyTracksContextProvider } from '../contexts/SpotifyTracksContext'
import { SpotifySavedTracksContextProvider } from '../contexts/SpotifySavedTracksContext'
import { SpotifySelectedTracksContextProvider } from '../contexts/SpotifySelectedTracksContext'
import LastfmAndSpotifyTracks from './LastfmAndSpotifyTracks'
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

  return <LastfmTrackSourceContextProvider>
    <LastfmTopTracksContextProvider period={period}>
      <LastfmLovedTracksContextProvider>
        <SpotifyTracksContextProvider>
          <SpotifySavedTracksContextProvider>
            <SpotifySelectedTracksContextProvider>
              <LastfmAndSpotifyTracks />
            </SpotifySelectedTracksContextProvider>
          </SpotifySavedTracksContextProvider>
        </SpotifyTracksContextProvider>
      </LastfmLovedTracksContextProvider>
    </LastfmTopTracksContextProvider>
  </LastfmTrackSourceContextProvider>
}

export default SpotifyAuthPage
