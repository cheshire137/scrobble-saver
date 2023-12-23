import { useContext } from 'react'
import { Header, Heading, PageLayout } from '@primer/react'
import { Outlet, useHref } from 'react-router-dom'
import { PageContext } from '../contexts/PageContext'
import { AuthContext } from '../contexts/AuthContext'

const AppLayout = () => {
  const env = import.meta.env
  const backendPort = env.VITE_BACKEND_PORT || 8080
  const { pageTitle } = useContext(PageContext)
  const { isSignedIntoLastfm, isSignedIntoSpotify } = useContext(AuthContext)

  return <PageLayout containerWidth="full" padding="none">
    <PageLayout.Header>
      <Header sx={{ px: 5 }}>
        <Header.Item full sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Heading as="h1">
            <Header.Link href={useHref('/')}>Scrobble Saver</Header.Link>
          </Heading>
          {pageTitle && pageTitle.length > 0 && <Heading
            as="h2"
            sx={{ fontWeight: 'normal', fontSize: 3, mx: 4 }}
          >{pageTitle}</Heading>}
        </Header.Item>
        {(isSignedIntoLastfm || isSignedIntoSpotify) && <Header.Item>
          <Header.Link href={`http://localhost:${backendPort}/logout`}>Log out</Header.Link>
        </Header.Item>}
      </Header>
    </PageLayout.Header>
    <PageLayout.Content width="full" sx={{ fontSize: 2, px: 5 }}>
      <Outlet />
    </PageLayout.Content>
  </PageLayout>
}

export default AppLayout
