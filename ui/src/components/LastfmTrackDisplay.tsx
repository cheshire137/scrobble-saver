import LastfmTrack from '../models/LastfmTrack'
import { Heading, Link } from '@primer/react'

interface Props {
  track: LastfmTrack
}

const LastfmTrackDisplay = ({ track }: Props) => {
  return <div>
    <Heading as="h3">
      <Link href={track.url}>#{track.rank} {track.name}</Link>
    </Heading>
    <p>
      by {track.artist.name}
    </p>
  </div>
}

export default LastfmTrackDisplay
