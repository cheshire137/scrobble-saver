import { useContext, useState } from 'react'
import { ActionList, ActionMenu } from '@primer/react'
import { LastfmTopTracksContext } from '../contexts/LastfmTopTracksContext'

const topTrackPeriods = ['overall', '7day', '1month', '3month', '6month', '12month']

const LastfmTopTracks = () => {
  const [period, setPeriod] = useState(topTrackPeriods[0])
  const { results } = useContext(LastfmTopTracksContext)
  console.log('results from context:', results)

  return <div>
    <ActionMenu>
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
  </div>
}

export default LastfmTopTracks
