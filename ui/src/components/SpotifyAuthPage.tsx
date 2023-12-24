import { useContext, useEffect } from 'react'
import { PageContext } from '../contexts/PageContext'
import { AuthContext } from '../contexts/AuthContext'
import { LastfmTopTracksContextProvider } from '../contexts/LastfmTopTracksContext'
import { LastfmLovedTracksContextProvider } from '../contexts/LastfmLovedTracksContext'
import { LastfmTrackSourceContextProvider, LovedTracksSource } from '../contexts/LastfmTrackSourceContext'
import { SpotifyTracksContextProvider } from '../contexts/SpotifyTracksContext'
import { SpotifySavedTracksContextProvider } from '../contexts/SpotifySavedTracksContext'
import { SpotifySelectedTracksContextProvider } from '../contexts/SpotifySelectedTracksContext'
import LastfmAndSpotifyTracks from './LastfmAndSpotifyTracks'
import { useSearchParams } from 'react-router-dom'

const SpotifyAuthPage = () => {
  const { setPageTitle } = useContext(PageContext)
  const { lastfmUsername } = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const period = searchParams.get('period')
  const lastfmSource = searchParams.get('lastfm_source')

  useEffect(() => {
    const prefix = `${lastfmUsername}'s `
    const trackSource = lastfmSource === LovedTracksSource ? 'loved' : 'top'
    const suffix = ' tracks on Last.fm'
    setPageTitle(`${prefix}${trackSource}${suffix}`)
  }, [setPageTitle, lastfmSource, lastfmUsername, period])

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
