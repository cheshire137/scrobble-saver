import LastfmTrack from '../models/LastfmTrack'
import { Avatar, Box, CounterLabel, Heading, Link } from '@primer/react'

interface Props {
  track: LastfmTrack
}

const LastfmTrackDisplay = ({ track }: Props) => {
  const image = track.images.find(image => image.size === 'medium')
  return <Box as="li" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
    <Heading as="h3" sx={{ fontSize: 2, display: 'flex', alignItems: 'center' }}>
      {image && <Avatar src={image.url} size={32} sx={{ mr: 2 }} />}
      <CounterLabel sx={{ mr: 1 }}>#{track.rank}</CounterLabel>
      <Link href={track.url} target="_blank">{track.name}</Link>
    </Heading>
    <Box sx={{ ml: 1, color: 'fg.muted' }}>
      by <Link href={track.artist.url} muted target="_blank">{track.artist.name}</Link>
    </Box>
    <Box sx={{ ml: 1, color: 'fg.muted' }}>
      &middot;
    </Box>
    <Box sx={{ fontStyle: 'italic', ml: 1, color: 'fg.muted' }}>
      {track.playCount} play{track.playCount === 1 ? '' : 's'}
    </Box>
  </Box>
}

export default LastfmTrackDisplay
