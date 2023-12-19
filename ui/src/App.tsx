import { BaseStyles, ThemeProvider } from '@primer/react'
import PageRoutes from './PageRoutes'
import { PageContextProvider } from './contexts/PageContext'
import { LastfmUserContextProvider } from './contexts/LastfmUserContext'
import { SpotifyUserContextProvider } from './contexts/SpotifyUserContext'

function App() {
  return <ThemeProvider>
    <BaseStyles>
      <PageContextProvider>
        <LastfmUserContextProvider>
          <SpotifyUserContextProvider>
            <PageRoutes />
          </SpotifyUserContextProvider>
        </LastfmUserContextProvider>
      </PageContextProvider>
    </BaseStyles>
  </ThemeProvider>
}

export default App
