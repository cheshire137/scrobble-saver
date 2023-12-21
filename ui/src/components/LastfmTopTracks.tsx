import { useContext } from 'react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import LastfmTrackDisplay from './LastfmTrackDisplay'
import { Box, Heading } from '@primer/react'
import LastfmTopTrackPeriodMenu from './LastfmTopTrackPeriodMenu'

const LastfmTopTracks = () => {
  const { results } = useContext(LastfmTopTracksContext)

  if (!results) return null

  return <Box>
    <Heading sx={{ mb: 2, color: 'lastfm.fg', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>Last.fm top tracks</span>
      <LastfmTopTrackPeriodMenu />
    </Heading>
    <Box as="ol" sx={{ listStyle: 'none', pl: 0 }}>
      {results.tracks.map(track => <LastfmTrackDisplay key={track.url} track={track} />)}
    </Box>
  </Box>
}

export default LastfmTopTracks
