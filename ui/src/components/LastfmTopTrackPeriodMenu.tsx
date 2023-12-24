import { useContext, useState } from 'react'
import { ActionList, ActionMenu } from '@primer/react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'
import { useSearchParams } from 'react-router-dom'
import { topTrackPeriods, topTrackPeriodLabel } from '../models/LastfmTopTrackPeriod'

const LastfmTopTrackPeriodMenu = () => {
  const [open, setOpen] = useState(false)
  const { page, limit, period, update } = useContext(LastfmTopTracksContext)
  const [searchParams, setSearchParams] = useSearchParams()

  return <ActionMenu open={open} onOpenChange={setOpen}>
    <ActionMenu.Button variant="invisible" sx={{ color: 'lastfm.fg' }}>
      Period: {topTrackPeriodLabel(period)}
    </ActionMenu.Button>
    <ActionMenu.Overlay width="auto">
      <ActionList selectionVariant="single">
        {topTrackPeriods.map(otherPeriod =>
          <ActionList.Item
            selected={period === otherPeriod.value}
            key={otherPeriod.value}
            onClick={() => {
              setOpen(false)
              setSearchParams({ ...searchParams, period: otherPeriod.value })
              update(page, otherPeriod.value, limit)
            }}
          >{otherPeriod.label}</ActionList.Item>
        )}
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
}

export default LastfmTopTrackPeriodMenu
