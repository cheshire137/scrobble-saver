import { Header, Heading, PageLayout } from '@primer/react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return <PageLayout>
    <PageLayout.Header>
      <Header>
        <Header.Item full>
          <Heading as="h1">
            Lastly Likes
          </Heading>
        </Header.Item>
      </Header>
    </PageLayout.Header>
    <PageLayout.Content sx={{ fontSize: 2 }}>
      <Outlet />
    </PageLayout.Content>
  </PageLayout>
}

export default AppLayout
