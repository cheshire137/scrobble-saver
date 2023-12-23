import { useContext } from 'react'
import { ActionList, Avatar, Box } from '@primer/react'
import SpotifyTrack from '../models/SpotifyTrack'
import { TrackContainerActionListItem } from './TrackContainer'
import SpotifySavedTrackStatus from './SpotifySavedTrackStatus'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'
import SpotifyAlbumDisplay from './SpotifyAlbumDisplay'

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
  const image = track.smallImage()

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
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {image && <Avatar src={image.url} square alt={`${track.album.name} cover art`} size={32} sx={{ mr: 2 }} />}
      <Box>
        {track.name} by {track.artists.map(artist => artist.name).join(', ')}
        <SpotifyAlbumDisplay album={track.album} />
      </Box>
    </Box>
    <ActionList.TrailingVisual sx={{ height: 'auto', display: 'flex', alignItems: 'center' }}>
      <SpotifySavedTrackStatus track={track} />
    </ActionList.TrailingVisual>
  </TrackContainerActionListItem>
}

export default SpotifyTrackDisplay
