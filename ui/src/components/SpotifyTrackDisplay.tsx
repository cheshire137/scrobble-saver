import { useContext } from 'react'
import { ActionList } from '@primer/react'
import SpotifyTrack from '../models/SpotifyTrack'
import { TrackContainerActionListItem, TrackContainerActionListLinkItem } from './TrackContainer'
import SpotifySavedTrackStatus from './SpotifySavedTrackStatus'
import SpotifyTrackMetadata from './SpotifyTrackMetadata'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'

interface Props {
  track: SpotifyTrack
  asLink: boolean
  onSelect?: ((event: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent<HTMLLIElement>) => void) | undefined
}

const SpotifyTrackDisplay = ({ track, asLink, ...props }: Props) => {
  const { selectedTrackIds, addSelectedTrackIds, deselectTrackIds } = useContext(SpotifySelectedTracksContext)
  const isSelected = selectedTrackIds.has(track.id)

  if (asLink) {
    return <TrackContainerActionListLinkItem href={track.url} target="_blank" rel="noopener noreferrer">
      <SpotifyTrackMetadata track={track} />
      <ActionList.TrailingVisual>
        <SpotifySavedTrackStatus track={track} />
      </ActionList.TrailingVisual>
    </TrackContainerActionListLinkItem>
  }

  return <TrackContainerActionListItem selected={isSelected} onSelect={e => {
    if (props.onSelect) props.onSelect(e)
    if (isSelected) {
      deselectTrackIds([track.id])
    } else {
      addSelectedTrackIds([track.id])
    }
  }}>
    <SpotifyTrackMetadata track={track} />
    <ActionList.TrailingVisual>
      <SpotifySavedTrackStatus track={track} />
    </ActionList.TrailingVisual>
  </TrackContainerActionListItem>
}

export default SpotifyTrackDisplay
