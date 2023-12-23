import { useContext } from 'react'
import { Octicon, Tooltip } from '@primer/react'
import { HeartIcon, HeartFillIcon } from '@primer/octicons-react'
import SpotifyTrack from '../models/SpotifyTrack'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'

interface Props {
  track: SpotifyTrack
}

const SpotifySavedTrackStatus = ({ track }: Props) => {
  const { savedStatusByTrackId } = useContext(SpotifySavedTracksContext)
  const trackSavedStatus = savedStatusByTrackId.get(track.id)

  if (typeof trackSavedStatus === 'undefined') return null

  const icon = trackSavedStatus ? HeartFillIcon : HeartIcon
  const title = trackSavedStatus ? 'Liked on Spotify' : 'Not a liked track on Spotify'

  return <Tooltip aria-label={title}>
    <Octicon icon={icon} size="medium" sx={{ ml: 2, color: 'spotify.fg' }} />
  </Tooltip>
}

export default SpotifySavedTrackStatus
