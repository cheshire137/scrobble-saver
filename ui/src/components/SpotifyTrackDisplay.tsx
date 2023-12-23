import { useContext } from 'react'
import { ActionList } from '@primer/react'
import SpotifyTrack from '../models/SpotifyTrack'
import { TrackContainerActionListItem } from './TrackContainer'
import SpotifySavedTrackStatus from './SpotifySavedTrackStatus'
import SpotifyTrackMetadata from './SpotifyTrackMetadata'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'

interface Props {
  track: SpotifyTrack
  selectable: boolean
  onSelect?: ((event: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent<HTMLLIElement>) => void) | undefined
}

const SpotifyTrackDisplay = ({ track, selectable, ...props }: Props) => {
  const { selectedTrackIds, toggle: toggleSelected } = useContext(SpotifySelectedTracksContext)
  const { savedTrackIds } = useContext(SpotifySavedTracksContext)
  const isTrackSaved = savedTrackIds.has(track.id)
  const isTrackSelected = selectedTrackIds.has(track.id)

  return <TrackContainerActionListItem
    disabled={isTrackSaved && selectable}
    selected={isTrackSelected && selectable}
    onSelect={e => {
      if (props.onSelect) props.onSelect(e)
      toggleSelected(track.id)
    }}
    sx={{
      color: isTrackSaved ? 'fg.default' : undefined,
    }}
  >
    <SpotifyTrackMetadata track={track} />
    <ActionList.TrailingVisual sx={{ height: 'auto', display: 'flex', alignItems: 'center' }}>
      <SpotifySavedTrackStatus track={track} />
    </ActionList.TrailingVisual>
  </TrackContainerActionListItem>
}

export default SpotifyTrackDisplay
