import { BaseStyles, ThemeProvider, theme } from '@primer/react'
import deepmerge from 'deepmerge'
import PageRoutes from './PageRoutes'
import { PageContextProvider } from './contexts/PageContext'
import { AuthContextProvider } from './contexts/AuthContext'
import { LastfmTopTracksContextProvider } from './contexts/LastfmTopTracksContext'
import { SpotifyTracksContextProvider } from './contexts/SpotifyTracksContext'
import themeOverrides from './themes/overrides'
import './App.css'

const customTheme = deepmerge(theme, themeOverrides)

function App() {
  return <ThemeProvider colorMode="day" theme={customTheme}>
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
