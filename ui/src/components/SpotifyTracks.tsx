import { useContext } from 'react'
import { SpotifyTracksContext } from '../contexts/SpotifyTracksContext'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import { Avatar, Box, Heading } from '@primer/react'
import SpotifyTrackDisplay from './SpotifyTrackDisplay'
import TrackContainer from './TrackContainer'
import SpotifyLogo from '../assets/Spotify_Icon_RGB_Green.png'
import SpotifyTrackSearch from './SpotifyTrackSearch'

const SpotifyTracks = () => {
  const { tracks: spotifyTracks, trackIdsByLastfmUrl: spotifyTrackIdsByLastfmUrl } = useContext(SpotifyTracksContext)
  const { results: lastfmTopTrackResults } = useContext(LastfmTopTracksContext)

  if (!lastfmTopTrackResults || lastfmTopTrackResults.tracks.length < 1) return null

  return <Box>
    <Heading sx={{ mb: 2, color: 'spotify.fg' }}>
      <Avatar
        sx={{ mr: 2, display: 'inline-block', verticalAlign: 'middle', boxShadow: 'none' }}
        size={32}
        src={SpotifyLogo}
      />
      Spotify tracks
    </Heading>
    <Box as="ol" sx={{ listStyle: 'none', pl: 0 }}>
      {lastfmTopTrackResults.tracks.map(lastfmTrack => {
        const spotifyTrackIds = spotifyTrackIdsByLastfmUrl[lastfmTrack.url] ?? []
        return <TrackContainer key={lastfmTrack.url} sx={{ minHeight: '32px' }}>
          {spotifyTrackIds.length < 1 && <SpotifyTrackSearch lastfmTrack={lastfmTrack} />}
          {spotifyTrackIds.map(spotifyTrackId => {
            const spotifyTrack = spotifyTracks.find(track => track.id === spotifyTrackId)
            return spotifyTrack ? <SpotifyTrackDisplay key={spotifyTrack.id} track={spotifyTrack} /> : null
          })}
        </TrackContainer>
      })}
    </Box>
  </Box>
}

export default SpotifyTracks
