import { useContext } from 'react'
import { Header, Heading, PageLayout } from '@primer/react'
import { Outlet, useHref } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { PageContext } from '../contexts/PageContext'

const AppLayout = () => {
  const env = import.meta.env
  const backendPort = env.VITE_BACKEND_PORT || 8080
  const { pageTitle } = useContext(PageContext)
  const { isSignedIntoLastfm, isSignedIntoSpotify, lastfmUsername, spotifyUserId } = useContext(AuthContext)
  const isFullySignedIn = isSignedIntoLastfm && isSignedIntoSpotify
  const spotifyAuthPageUrl = useHref(`/lastfm/${lastfmUsername}/spotify/${spotifyUserId}`)

  return <PageLayout containerWidth="full" padding="none">
    <PageLayout.Header>
      <Header sx={{ px: 5 }}>
        <Header.Item full sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Heading as="h1">
            <Header.Link href={useHref('/')}>Scrobble Saver</Header.Link>
          </Heading>
          {pageTitle && pageTitle.length > 0 && <Heading
            as="h2"
            sx={{ fontSize: 3, fontWeight: 'normal', ml: 3 }}
          >{pageTitle}</Heading>}
          {isFullySignedIn && <>
            <Header.Link sx={{ ml: 3 }} href={`${spotifyAuthPageUrl}?lastfm_source=top`}>
              Top tracks
            </Header.Link>
            <Header.Link sx={{ ml: 3 }} href={`${spotifyAuthPageUrl}?lastfm_source=loved`}>
              Loved tracks
            </Header.Link>
          </>}
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
