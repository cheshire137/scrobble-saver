import { useContext } from 'react'
import { Box } from '@primer/react'
import { LastfmTrackSourceContext } from '../contexts/LastfmTrackSourceContext'
import LastfmTopTracks from './LastfmTopTracks'
import LastfmLovedTracks from './LastfmLovedTracks'
import SpotifyTracks from './SpotifyTracks'

const LastfmAndSpotifyTracks = () => {
  const { isLovedTracks } = useContext(LastfmTrackSourceContext)
  return <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: 4 }}>
    {isLovedTracks ? <LastfmLovedTracks /> : <LastfmTopTracks />}
    <SpotifyTracks />
  </Box>
}

export default LastfmAndSpotifyTracks
