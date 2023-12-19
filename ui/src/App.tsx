import { BaseStyles, ThemeProvider } from '@primer/react'
import PageRoutes from './PageRoutes'
import { PageContextProvider } from './contexts/PageContext'
import { LastfmUserContextProvider } from './contexts/LastfmUserContext'
import { SpotifyUserContextProvider } from './contexts/SpotifyUserContext'
import { LastfmTopTracksContextProvider } from './contexts/LastfmTopTracksContext'

function App() {
  return <ThemeProvider>
    <BaseStyles>
      <PageContextProvider>
        <LastfmUserContextProvider>
          <LastfmTopTracksContextProvider>
            <SpotifyUserContextProvider>
              <PageRoutes />
            </SpotifyUserContextProvider>
          </LastfmTopTracksContextProvider>
        </LastfmUserContextProvider>
      </PageContextProvider>
    </BaseStyles>
  </ThemeProvider>
}

export default App
