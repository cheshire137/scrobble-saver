import { BaseStyles, ThemeProvider } from '@primer/react'
import PageRoutes from './PageRoutes'
import { PageContextProvider } from './contexts/PageContext'
import { AuthContextProvider } from './contexts/AuthContext'
import { LastfmTopTracksContextProvider } from './contexts/LastfmTopTracksContext'

function App() {
  return <ThemeProvider>
    <BaseStyles>
      <PageContextProvider>
        <AuthContextProvider>
          <LastfmTopTracksContextProvider>
            <PageRoutes />
          </LastfmTopTracksContextProvider>
        </AuthContextProvider>
      </PageContextProvider>
    </BaseStyles>
  </ThemeProvider>
}

export default App
