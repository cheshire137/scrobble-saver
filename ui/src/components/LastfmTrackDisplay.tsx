import LastfmTrack from '../models/LastfmTrack'
import { Heading, Link } from '@primer/react'

interface Props {
  track: LastfmTrack
}

const LastfmTrackDisplay = ({ track }: Props) => {
  return <div>
    <Heading as="h3">
      <Link href={track.url} target="_blank">#{track.rank} {track.name}</Link>
    </Heading>
    <p>
      by <Link href={track.artist.url} target="_blank">{track.artist.name}</Link>
    </p>
  </div>
}

export default LastfmTrackDisplay
