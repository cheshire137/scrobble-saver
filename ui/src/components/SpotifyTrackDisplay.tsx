import { useContext, useRef } from 'react'
import { ActionList, Box, Heading, Truncate } from '@primer/react'
import SpotifyTrack from '../models/SpotifyTrack'
import { TrackContainerActionListItem } from './TrackContainer'
import SpotifySavedTrackStatus from './SpotifySavedTrackStatus'
import { SpotifySelectedTracksContext } from '../contexts/SpotifySelectedTracksContext'
import { SpotifySavedTracksContext } from '../contexts/SpotifySavedTracksContext'

interface Props {
  track: SpotifyTrack
  selectable: boolean
  onSelect?: ((event: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent<HTMLLIElement>) => void) | undefined
}

const SpotifyTrackDisplay = ({ track, selectable, ...props }: Props) => {
  const { selectedTrackIds, toggle: toggleSelected } = useContext(SpotifySelectedTracksContext)
  const { savedTrackIds } = useContext(SpotifySavedTracksContext)
  const trackAndArtistRef = useRef<HTMLDivElement>(null)
  const trackAndArtistSeparatorRef = useRef<HTMLSpanElement>(null)
  const trackNameRef = useRef<HTMLHeadingElement>(null)
  const isTrackSaved = savedTrackIds.has(track.id)
  const isTrackSelected = selectedTrackIds.has(track.id)
  const albumImage = track.mediumAlbumImage()
  const artistNames = track.artistNames()
  const trackAndArtistEl = trackAndArtistRef.current
  const trackAndArtistSeparatorEl = trackAndArtistSeparatorRef.current
  const trackNameEl = trackNameRef.current
  const availableArtistWidth = trackAndArtistEl && trackAndArtistSeparatorEl && trackNameEl
    ? trackAndArtistEl.clientWidth - trackNameEl.clientWidth - trackAndArtistSeparatorEl.clientWidth - 8
    : undefined

  return <TrackContainerActionListItem
    disabled={isTrackSaved && selectable}
    selected={isTrackSelected && selectable}
    onSelect={e => {
      if (props.onSelect) props.onSelect(e)
      toggleSelected(track.id)
    }}
    sx={{
      color: isTrackSaved ? 'fg.default' : undefined,
      backgroundImage: albumImage ? `url('${albumImage.url}')` : undefined,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top 0 left 36px',
      backgroundSize: 'contain',
    }}
  >
    <ActionList.LeadingVisual sx={{ width: '80px', maxWidth: '80px' }}></ActionList.LeadingVisual>
    <Box>
      <Box
        ref={trackAndArtistRef}
        sx={{ display: 'flex', alignItems: 'center', fontSize: 2, flexWrap: 'wrap', width: '100%' }}
      >
        <Heading ref={trackNameRef} as="h3" sx={{ fontSize: 2, mr: 1 }}>{track.name}</Heading>
        <Box sx={{ color: 'fg.muted' }}>
          <Box as="span" sx={{ display: 'inline-block', mr: 1 }} ref={trackAndArtistSeparatorRef}>by</Box>
          <Truncate maxWidth={availableArtistWidth} inline title={artistNames}>{artistNames}</Truncate>
        </Box>
      </Box>
      <Box sx={{ fontSize: 1, color: 'fg.muted', mt: 1 }}>
        &ldquo;{track.album.name}&rdquo; / {track.album.releaseYear()}
      </Box>
    </Box>
    <ActionList.TrailingVisual sx={{ height: 'auto', display: 'flex', alignItems: 'center' }}>
      <SpotifySavedTrackStatus track={track} />
    </ActionList.TrailingVisual>
  </TrackContainerActionListItem>
}

export default SpotifyTrackDisplay
