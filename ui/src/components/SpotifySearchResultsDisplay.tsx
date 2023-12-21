import { Octicon, Tooltip } from '@primer/react'
import { CheckIcon, XIcon } from '@primer/octicons-react'
import SpotifyTrackSearchResults from '../models/SpotifyTrackSearchResults'

interface Props {
  results: SpotifyTrackSearchResults
}

const SpotifySearchResultDisplay = ({ results: { tracks } }: Props) => {
  if (tracks.length < 1) {
    return <Tooltip aria-label="No Spotify tracks found">
      <Octicon color="danger.fg" sx={{ ml: 2 }} icon={XIcon} />
    </Tooltip>
  }
  return <Tooltip aria-label="Found on Spotify">
    <Octicon color="success.fg" sx={{ ml: 2 }} icon={CheckIcon} />
  </Tooltip>
}

export default SpotifySearchResultDisplay
