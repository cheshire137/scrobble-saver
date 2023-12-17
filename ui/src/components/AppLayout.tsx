import { PageLayout } from '@primer/react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return <PageLayout>
    <PageLayout.Content sx={{ fontSize: 2 }}>
      <Outlet />
    </PageLayout.Content>
  </PageLayout>
}

export default AppLayout
