import { useContext } from 'react'
import { SpotifyTracksContext } from '../contexts/SpotifyTracksContext'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import { Box } from '@primer/react'
import SpotifyTrackDisplay from './SpotifyTrackDisplay'
import TrackContainer from './TrackContainer'

const SpotifyTracks = () => {
  const { tracks: spotifyTracks, trackIdsByLastfmUrl: spotifyTrackIdsByLastfmUrl } = useContext(SpotifyTracksContext)
  const { results: lastfmTopTrackResults } = useContext(LastfmTopTracksContext)
  if (spotifyTracks.length < 1) return null
  if (!lastfmTopTrackResults || lastfmTopTrackResults.tracks.length < 1) return null

  return <Box as="ol" sx={{ listStyle: 'none', pl: 0 }}>
    {lastfmTopTrackResults.tracks.map(lastfmTrack => {
      const spotifyTrackIds = spotifyTrackIdsByLastfmUrl[lastfmTrack.url] ?? []
      return <TrackContainer key={lastfmTrack.url} sx={{ minHeight: '32px' }}>
        {spotifyTrackIds.length < 1 && <span>&mdash;</span>}
        {spotifyTrackIds.map(spotifyTrackId => {
          const spotifyTrack = spotifyTracks.find(track => track.id === spotifyTrackId)
          return spotifyTrack ? <SpotifyTrackDisplay key={spotifyTrack.id} track={spotifyTrack} /> : null
        })}
      </TrackContainer>
    })}
  </Box>
}

export default SpotifyTracks
