import { useContext } from 'react'
import { ActionList, ActionMenu } from '@primer/react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'

const topTrackPeriods = [
  { value: 'overall', label: 'All time' },
  { value: '7day', label: 'Last week' },
  { value: '1month', label: 'Last month' },
  { value: '3month', label: 'Last 3 months' },
  { value: '6month', label: 'Last 6 months' },
  { value: '12month', label: 'Last year' },
]

const LastfmTopTrackPeriodMenu = () => {
  const { page, limit, period, update } = useContext(LastfmTopTracksContext)

  return <ActionMenu>
    <ActionMenu.Button sx={{ mb: 3 }}>
      Period: {period}
    </ActionMenu.Button>
    <ActionMenu.Overlay width="small">
      <ActionList selectionVariant="single">
        {topTrackPeriods.map(otherPeriod =>
          <ActionList.Item
            selected={period === otherPeriod.value}
            key={otherPeriod.value}
            onClick={() => update(page, otherPeriod.value, limit)}
          >{otherPeriod.label}</ActionList.Item>
        )}
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
}

export default LastfmTopTrackPeriodMenu
