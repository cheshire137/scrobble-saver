import { useContext } from 'react'
import { LastfmLovedTracksContext } from '../contexts/LastfmLovedTracksContext'
import LastfmTrackDisplay from './LastfmTrackDisplay'
import { Avatar, Box, Heading } from '@primer/react'
import LastfmLogo from '../assets/lastfm64x64.png'

const LastfmLovedTracks = () => {
  const { results } = useContext(LastfmLovedTracksContext)

  if (!results) return null

  return <Box>
  <Heading sx={{ mb: 2, color: 'lastfm.fg', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span>
      <Avatar
        sx={{ mr: 2, display: 'inline-block', verticalAlign: 'middle', boxShadow: 'none' }}
        size={32}
        src={LastfmLogo}
      />
      Last.fm loved tracks
    </span>
  </Heading>
  <Box as="ol" sx={{ listStyle: 'none', pl: 0 }}>
    {results.tracks.map(track => <LastfmTrackDisplay key={track.url} track={track} />)}
  </Box>
</Box>
}

export default LastfmLovedTracks
