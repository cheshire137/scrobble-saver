import { Box } from '@primer/react'
import SpotifyAlbum from '../models/SpotifyAlbum'

interface Props {
  album: SpotifyAlbum
}

const SpotifyAlbumDisplay = ({ album }: Props) => {
  return <Box sx={{ fontSize: 1, color: 'fg.muted' }}>
    &ldquo;{album.name}&rdquo; / {album.releaseYear()}
  </Box>
}

export default SpotifyAlbumDisplay
