import { useContext } from 'react'
import { ActionList } from '@primer/react'
import SpotifyTrack from '../models/SpotifyTrack'
import { TrackContainerActionListItem, TrackContainerActionListLinkItem } from './TrackContainer'
import SpotifySavedTrackStatus from './SpotifySavedTrackStatus'
import SpotifyTrackMetadata from './SpotifyTrackMetadata'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'

interface Props {
  track: SpotifyTrack
  asLink: boolean
  onSelect?: ((event: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent<HTMLLIElement>) => void) | undefined
}

const SpotifyTrackDisplay = ({ track, asLink, ...props }: Props) => {
  const { selectedTrackIds, toggle: toggleSelected } = useContext(SpotifySelectedTracksContext)
  const { savedTrackIds } = useContext(SpotifySavedTracksContext)
  const isTrackSaved = savedTrackIds.has(track.id)

  if (asLink) {
    return <TrackContainerActionListLinkItem href={track.url} target="_blank" rel="noopener noreferrer">
      <SpotifyTrackMetadata track={track} />
      <ActionList.TrailingVisual>
        <SpotifySavedTrackStatus track={track} />
      </ActionList.TrailingVisual>
    </TrackContainerActionListLinkItem>
  }

  return <TrackContainerActionListItem
    disabled={isTrackSaved}
    selected={selectedTrackIds.has(track.id)}
    onSelect={e => {
      if (props.onSelect) props.onSelect(e)
      toggleSelected(track.id)
    }}
    sx={{
      color: isTrackSaved ? 'fg.default' : undefined,
    }}
  >
    <SpotifyTrackMetadata track={track} />
    <ActionList.TrailingVisual>
      <SpotifySavedTrackStatus track={track} />
    </ActionList.TrailingVisual>
  </TrackContainerActionListItem>
}

export default SpotifyTrackDisplay
