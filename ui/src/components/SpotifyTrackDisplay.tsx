import { ActionList, Link } from '@primer/react'
import SpotifyTrack from '../models/SpotifyTrack'
import { TrackContainerActionListItem, TrackContainerActionListLinkItem } from './TrackContainer'
import SpotifySavedTrackStatus from './SpotifySavedTrackStatus'
import SpotifyTrackMetadata from './SpotifyTrackMetadata'

interface Props {
  track: SpotifyTrack
  asLink: boolean
}

const SpotifyTrackDisplay = ({ track, asLink }: Props) => {
  if (asLink) {
    return <TrackContainerActionListLinkItem href={track.url} target="_blank" rel="noopener noreferrer">
      <SpotifyTrackMetadata track={track} />
      <ActionList.TrailingVisual>
        <SpotifySavedTrackStatus track={track} />
      </ActionList.TrailingVisual>
    </TrackContainerActionListLinkItem>
  }

  return <TrackContainerActionListItem>
    <SpotifyTrackMetadata track={track} />
    <ActionList.TrailingVisual>
      <SpotifySavedTrackStatus track={track} />
    </ActionList.TrailingVisual>
  </TrackContainerActionListItem>
}

export default SpotifyTrackDisplay
