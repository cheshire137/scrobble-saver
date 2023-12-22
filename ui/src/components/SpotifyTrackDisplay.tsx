import { ActionList, Avatar, Box, Link } from '@primer/react'
import SpotifyTrack from '../models/SpotifyTrack'
import SpotifyAlbumDisplay from './SpotifyAlbumDisplay'
import { TrackContainerActionListItem } from './TrackContainer'
import SpotifySavedTrackStatus from './SpotifySavedTrackStatus'

interface Props {
  track: SpotifyTrack
}

const SpotifyTrackDisplay = ({ track }: Props) => {
  const image = track.smallImage()

  return <TrackContainerActionListItem>
    <Link sx={{ display: 'flex', alignItems: 'center' }} href={track.url} target="_blank">
      {image && <Avatar src={image.url} square alt={`${track.album.name} cover art`} size={32} sx={{ mr: 2 }} />}
      <Box>
        {track.name} by {track.artists.map(artist => artist.name).join(', ')}
        <SpotifyAlbumDisplay album={track.album} />
      </Box>
    </Link>
    <ActionList.TrailingVisual>
      <SpotifySavedTrackStatus track={track} />
    </ActionList.TrailingVisual>
  </TrackContainerActionListItem>
}

export default SpotifyTrackDisplay
