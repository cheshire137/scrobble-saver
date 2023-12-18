import LastfmTrack from '../models/LastfmTrack'
import { Avatar, Box, Heading, Link } from '@primer/react'

interface Props {
  track: LastfmTrack
}

const LastfmTrackDisplay = ({ track }: Props) => {
  const image = track.images.find(image => image.size === 'medium')
  return <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
    <Heading as="h3" sx={{ fontSize: 2 }}>
      {image && <Avatar src={image.url} size={32} sx={{ mr: 2 }} />}
      <Link href={track.url} target="_blank">#{track.rank} {track.name}</Link>
    </Heading>
    <Box sx={{ ml: 1 }}>
      by <Link href={track.artist.url} target="_blank">{track.artist.name}</Link>
    </Box>
  </Box>
}

export default LastfmTrackDisplay
