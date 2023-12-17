import { createContext, PropsWithChildren, useState, useEffect, useMemo } from 'react'

export type PageContextProps = {
  pageTitle: string
  setPageTitle: (pageTitle: string) => void
}

export const PageContext = createContext<PageContextProps>({
  pageTitle: '',
  setPageTitle: () => { },
})

export const PageContextProvider = ({ children }: PropsWithChildren) => {
  const [pageTitle, setPageTitle] = useState('')
  const contextProps = useMemo(() => ({ pageTitle, setPageTitle }), [pageTitle, setPageTitle])

  useEffect(() => {
    if (pageTitle.length > 0) {
      document.title = `${pageTitle} - Lastly Likes`
    } else {
      document.title = 'Lastly Likes'
    }
  }, [pageTitle])

  return <PageContext.Provider value={contextProps}>{children}</PageContext.Provider>
}
