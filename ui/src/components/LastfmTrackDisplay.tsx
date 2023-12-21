import LastfmTrack from '../models/LastfmTrack'
import { Avatar, Box, CounterLabel, Heading, Link } from '@primer/react'
import TrackContainer from './TrackContainer'

interface Props {
  track: LastfmTrack
}

const LastfmTrackDisplay = ({ track: lastfmTrack }: Props) => {
  const image = lastfmTrack.mediumImage()
  return <TrackContainer sx={{ display: 'flex', alignItems: 'center' }}>
    <Heading as="h3" sx={{ fontSize: 2, display: 'flex', alignItems: 'center' }}>
      {image && <Avatar src={image.url} size={32} sx={{ mr: 2 }} />}
      <CounterLabel sx={{ mr: 1 }}>#{lastfmTrack.rank}</CounterLabel>
      <Link href={lastfmTrack.url} target="_blank">{lastfmTrack.name}</Link>
    </Heading>
    <Box sx={{ ml: 1, color: 'fg.muted' }}>
      by <Link href={lastfmTrack.artist.url} muted target="_blank">{lastfmTrack.artist.name}</Link>
    </Box>

  </TrackContainer>
}

export default LastfmTrackDisplay
