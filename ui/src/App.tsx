import { BaseStyles, ThemeProvider } from '@primer/react'
import PageRoutes from './PageRoutes'
import { PageContextProvider } from './contexts/PageContext'

function App() {
  return <ThemeProvider>
    <BaseStyles>
      <PageContextProvider>
        <PageRoutes />
      </PageContextProvider>
    </BaseStyles>
  </ThemeProvider>
}

export default App
