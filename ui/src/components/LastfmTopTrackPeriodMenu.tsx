import { useState } from 'react'
import { ActionList, ActionMenu } from '@primer/react'

const topTrackPeriods = ['overall', '7day', '1month', '3month', '6month', '12month']

const LastfmTopTrackPeriodMenu = () => {
  const [period, setPeriod] = useState(topTrackPeriods[0])
  return <ActionMenu>
    <ActionMenu.Button>
      Period: {period}
    </ActionMenu.Button>
    <ActionMenu.Overlay width="small">
      <ActionList selectionVariant="single">
        {topTrackPeriods.map(otherPeriod =>
          <ActionList.Item
            selected={period === otherPeriod}
            key={otherPeriod}
            onClick={() => setPeriod(otherPeriod)}
          >{otherPeriod}</ActionList.Item>
        )}
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
}

export default LastfmTopTrackPeriodMenu
