import LastfmTrack from '../models/LastfmTrack'
import { Avatar, Box, CounterLabel, Heading, Link } from '@primer/react'

interface Props {
  track: LastfmTrack
}

const LastfmTrackDisplay = ({ track }: Props) => {
  const image = track.images.find(image => image.size === 'medium')
  return <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
    <Heading as="h3" sx={{ fontSize: 2, display: 'flex', alignItems: 'center' }}>
      {image && <Avatar src={image.url} size={32} sx={{ mr: 2 }} />}
      <CounterLabel sx={{ mr: 1 }}>#{track.rank}</CounterLabel>
      <Link href={track.url} target="_blank">{track.name}</Link>
    </Heading>
    <Box sx={{ ml: 1, color: 'fg.muted' }}>
      by <Link href={track.artist.url} muted target="_blank">{track.artist.name}</Link>
    </Box>
  </Box>
}

export default LastfmTrackDisplay
