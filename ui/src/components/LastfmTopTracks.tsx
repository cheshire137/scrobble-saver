import { useContext } from 'react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import LastfmTrackDisplay from './LastfmTrackDisplay'
import { Box, Heading } from '@primer/react'

const LastfmTopTracks = () => {
  const { results } = useContext(LastfmTopTracksContext)

  if (!results) return null

  return <Box>
    <Heading sx={{ color: 'lastfm.fg' }}>Last.fm top tracks</Heading>
    <Box as="ol" sx={{ listStyle: 'none', pl: 0 }}>
      {results.tracks.map(track => <LastfmTrackDisplay key={track.url} track={track} />)}
    </Box>
  </Box>
}

export default LastfmTopTracks
