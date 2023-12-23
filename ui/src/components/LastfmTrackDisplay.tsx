import LastfmTrack from '../models/LastfmTrack'
import { Box, CounterLabel, Heading, Link } from '@primer/react'
import { TrackContainerBox } from './TrackContainer'

interface Props {
  track: LastfmTrack
}

const LastfmTrackDisplay = ({ track: lastfmTrack }: Props) => {
  return <TrackContainerBox>
    <CounterLabel sx={{ fontSize: 2, mr: 3, p: 2 }}>#{lastfmTrack.rank}</CounterLabel>
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Heading as="h3" sx={{ fontSize: 2, display: 'flex', alignItems: 'center' }}>
          <Link href={lastfmTrack.url} sx={{ color: 'lastfm.fg' }} target="_blank">{lastfmTrack.name}</Link>
        </Heading>
        <Box sx={{ ml: 1, color: 'fg.muted' }}>
          by <Link href={lastfmTrack.artist.url} muted target="_blank">{lastfmTrack.artist.name}</Link>
        </Box>
      </Box>
      <Box sx={{ fontSize: 1, color: 'fg.muted', mt: 1 }}>
        {lastfmTrack.playCount} play{lastfmTrack.playCount === 1 ? '' : 's'}
      </Box>
    </Box>
  </TrackContainerBox>
}

export default LastfmTrackDisplay
