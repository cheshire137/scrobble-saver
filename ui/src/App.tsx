import { BaseStyles, ThemeProvider } from '@primer/react'
import PageRoutes from './PageRoutes'
import { PageContextProvider } from './contexts/PageContext'
import { AuthContextProvider } from './contexts/AuthContext'
import { LastfmTopTracksContextProvider } from './contexts/LastfmTopTracksContext'
import { SpotifyTracksContextProvider } from './contexts/SpotifyTracksContext'

function App() {
  return <ThemeProvider>
    <BaseStyles>
      <PageContextProvider>
        <AuthContextProvider>
          <LastfmTopTracksContextProvider>
            <SpotifyTracksContextProvider>
              <PageRoutes />
            </SpotifyTracksContextProvider>
          </LastfmTopTracksContextProvider>
        </AuthContextProvider>
      </PageContextProvider>
    </BaseStyles>
  </ThemeProvider>
}

export default App
