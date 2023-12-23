import { BaseStyles, ThemeProvider, theme } from '@primer/react'
import deepmerge from 'deepmerge'
import PageRoutes from './PageRoutes'
import { PageContextProvider } from './contexts/PageContext'
import { AuthContextProvider } from './contexts/AuthContext'
import themeOverrides from './themes/overrides'
import './App.css'

const customTheme = deepmerge(theme, themeOverrides)

function App() {
  return <ThemeProvider colorMode="day" theme={customTheme}>
    <BaseStyles>
      <PageContextProvider>
        <AuthContextProvider>
          <PageRoutes />
        </AuthContextProvider>
      </PageContextProvider>
    </BaseStyles>
  </ThemeProvider>
}

export default App
