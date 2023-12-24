import { Avatar, Flash, Heading, Spinner } from '@primer/react'
import SpotifyLogo from '../assets/Spotify_Icon_RGB_Green.png'
import SaveSpotifyTracksButton from './SaveSpotifyTracksButton'

interface Props {
  checkingSavedTracks: boolean
  checkSavedTracksError?: string
}

const SpotifyTracksHeader = ({ checkingSavedTracks, checkSavedTracksError }: Props) => {
  return <Heading sx={{ mb: 2, color: 'spotify.fg', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span>
      <Avatar
        sx={{ mr: 2, display: 'inline-block', verticalAlign: 'middle', boxShadow: 'none' }}
        size={32}
        src={SpotifyLogo}
      />
      Spotify tracks
    </span>
    {checkingSavedTracks && <Spinner sx={{ ml: 2 }} />}
    {checkSavedTracksError && <Flash variant="danger" sx={{ ml: 2 }}>{checkSavedTracksError}</Flash>}
    <SaveSpotifyTracksButton />
  </Heading>
}

export default SpotifyTracksHeader
