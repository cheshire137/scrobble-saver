import { useContext } from 'react'
import { ActionList, ActionMenu } from '@primer/react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'

const topTrackPeriods = ['overall', '7day', '1month', '3month', '6month', '12month']

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
            selected={period === otherPeriod}
            key={otherPeriod}
            onClick={() => update(page, otherPeriod, limit)}
          >{otherPeriod}</ActionList.Item>
        )}
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
}

export default LastfmTopTrackPeriodMenu
