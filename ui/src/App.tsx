import { BaseStyles, ThemeProvider } from '@primer/react'
import PageRoutes from './PageRoutes'

function App() {
  return <ThemeProvider>
    <BaseStyles>
      <PageRoutes />
    </BaseStyles>
  </ThemeProvider>
}

export default App
