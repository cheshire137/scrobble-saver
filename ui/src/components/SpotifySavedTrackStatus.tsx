import { useContext } from 'react'
import { Octicon } from '@primer/react'
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

  return <Octicon icon={icon} sx={{ ml: 2, color: 'spotify.fg' }} />
}

export default SpotifySavedTrackStatus
