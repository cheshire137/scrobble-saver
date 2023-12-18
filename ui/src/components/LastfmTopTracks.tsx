import { useContext } from 'react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import LastfmTrackDisplay from './LastfmTrackDisplay'
import LastfmTopTrackPeriodMenu from './LastfmTopTrackPeriodMenu'
import { Box } from '@primer/react'

const LastfmTopTracks = () => {
  const { results } = useContext(LastfmTopTracksContext)

  if (!results) return <LastfmTopTrackPeriodMenu />

  return <div>
    <LastfmTopTrackPeriodMenu />
    <Box as="ol" sx={{ listStyle: 'none', pl: 0 }}>
      {results.tracks.map(track => <LastfmTrackDisplay key={track.url} track={track} />)}
    </Box>
  </div>
}

export default LastfmTopTracks
