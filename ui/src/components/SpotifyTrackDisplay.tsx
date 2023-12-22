import { useContext } from 'react'
import { Avatar, Box, Link, Octicon } from '@primer/react'
import { HeartFillIcon } from '@primer/octicons-react'
import SpotifyTrack from '../models/SpotifyTrack'
import SpotifyAlbumDisplay from './SpotifyAlbumDisplay'
import { TrackContainerActionListItem } from './TrackContainer'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'

interface Props {
  track: SpotifyTrack
}

const SpotifyTrackDisplay = ({ track }: Props) => {
  const image = track.smallImage()
  const { savedTrackIds } = useContext(SpotifySavedTracksContext)
  const isTrackSavedToSpotifyLibrary = savedTrackIds.has(track.id)

  return <TrackContainerActionListItem>
    <Link sx={{ display: 'flex', alignItems: 'center' }} href={track.url} target="_blank">
      {image && <Avatar src={image.url} square alt={`${track.album.name} cover art`} size={32} sx={{ mr: 2 }} />}
      <Box>
        {track.name} by {track.artists.map(artist => artist.name).join(', ')}
        <SpotifyAlbumDisplay album={track.album} />
      </Box>
    </Link>
    {isTrackSavedToSpotifyLibrary && <Octicon icon={HeartFillIcon} sx={{ ml: 2, color: 'spotify.fg' }} />}
  </TrackContainerActionListItem>
}

export default SpotifyTrackDisplay
