import { useContext } from 'react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import LastfmTrackDisplay from './LastfmTrackDisplay'
import LastfmTopTrackPeriodMenu from './LastfmTopTrackPeriodMenu'

const LastfmTopTracks = () => {
  const { results } = useContext(LastfmTopTracksContext)

  if (!results) return <LastfmTopTrackPeriodMenu />

  return <div>
    <LastfmTopTrackPeriodMenu />
    {results.tracks.map(track => <LastfmTrackDisplay key={track.url} track={track} />)}
  </div>
}

export default LastfmTopTracks
