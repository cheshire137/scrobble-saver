import { BaseStyles, ThemeProvider } from '@primer/react'
import PageRoutes from './PageRoutes'
import { PageContextProvider } from './contexts/PageContext'
import { LastfmUserContextProvider } from './contexts/LastfmUserContext'

function App() {
  return <ThemeProvider>
    <BaseStyles>
      <PageContextProvider>
        <LastfmUserContextProvider>
          <PageRoutes />
        </LastfmUserContextProvider>
      </PageContextProvider>
    </BaseStyles>
  </ThemeProvider>
}

export default App
