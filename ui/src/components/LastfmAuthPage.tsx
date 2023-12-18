import { useContext, useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { ActionList, ActionMenu } from '@primer/react'
import { PageContext } from '../contexts/PageContext'

const topTrackPeriods = ['overall', '7day', '1month', '3month', '6month', '12month']

const LastfmAuthPage = () => {
  const username = useLoaderData() as string
  const { setPageTitle } = useContext(PageContext)
  const [period, setPeriod] = useState(topTrackPeriods[0])

  useEffect(() => {
    setPageTitle(`Last.fm ${username}`)
  }, [setPageTitle, username])

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
    Signed in as {username}
  </div>
}

export default LastfmAuthPage
