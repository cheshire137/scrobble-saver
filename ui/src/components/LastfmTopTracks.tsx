import { useContext } from 'react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import LastfmTrackDisplay from './LastfmTrackDisplay'
import { Box } from '@primer/react'

const LastfmTopTracks = () => {
  const { results } = useContext(LastfmTopTracksContext)

  if (!results) return null

  return <>
    <Box as="ol" sx={{ listStyle: 'none', pl: 0 }}>
      {results.tracks.map(track => <LastfmTrackDisplay key={track.url} track={track} />)}
    </Box>
  </>
}

export default LastfmTopTracks
