import { useContext } from 'react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import LastfmTrackDisplay from './LastfmTrackDisplay'
import { Avatar, Box, Heading, Pagination } from '@primer/react'
import LastfmTopTrackPeriodMenu from './LastfmTopTrackPeriodMenu'
import LastfmLogo from '../assets/lastfm64x64.png'

const LastfmTopTracks = () => {
  const { results, update, period, limit } = useContext(LastfmTopTracksContext)

  if (!results) return null

  return <Box>
    <Heading sx={{ mb: 2, color: 'lastfm.fg', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>
        <Avatar
          sx={{ mr: 2, display: 'inline-block', verticalAlign: 'middle', boxShadow: 'none' }}
          size={32}
          src={LastfmLogo}
        />
        Last.fm top tracks
      </span>
      <LastfmTopTrackPeriodMenu />
    </Heading>
    <Box as="ol" sx={{ listStyle: 'none', pl: 0 }}>
      {results.tracks.map(track => <LastfmTrackDisplay key={track.url} track={track} />)}
    </Box>
    <Pagination pageCount={results.totalPages} currentPage={results.page} onPageChange={(evt, pg) => {
      evt.preventDefault()
      update(pg, period, limit)
    }} />
  </Box>
}

export default LastfmTopTracks
