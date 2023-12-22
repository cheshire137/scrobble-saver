import { Avatar, Box } from '@primer/react'
import SpotifyTrack from '../models/SpotifyTrack'
import SpotifyAlbumDisplay from './SpotifyAlbumDisplay'

interface Props {
  track: SpotifyTrack
}

const SpotifyTrackMetadata = ({ track }: Props) => {
  const image = track.smallImage()

  return <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {image && <Avatar src={image.url} square alt={`${track.album.name} cover art`} size={32} sx={{ mr: 2 }} />}
    <Box>
      {track.name} by {track.artists.map(artist => artist.name).join(', ')}
      <SpotifyAlbumDisplay album={track.album} />
    </Box>
  </Box>
}

export default SpotifyTrackMetadata
