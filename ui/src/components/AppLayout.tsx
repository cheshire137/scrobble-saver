import { useContext } from 'react'
import { Header, Heading, PageLayout } from '@primer/react'
import { Outlet, useHref } from 'react-router-dom'
import { PageContext } from '../contexts/PageContext'

const AppLayout = () => {
  const { pageTitle } = useContext(PageContext)
  return <PageLayout>
    <PageLayout.Header>
      <Header>
        <Header.Item full>
          <Heading as="h1">
            <Header.Link href={useHref('/')}>Lastly Likes</Header.Link>
          </Heading>
          {pageTitle && pageTitle.length > 0 && <Heading
            as="h2"
            sx={{ fontWeight: 'normal', fontSize: 3, mx: 4 }}
          >{pageTitle}</Heading>}
        </Header.Item>
      </Header>
    </PageLayout.Header>
    <PageLayout.Content sx={{ fontSize: 2 }}>
      <Outlet />
    </PageLayout.Content>
  </PageLayout>
}

export default AppLayout
