import { Link } from '@primer/react'
import { useEffect, useContext } from 'react'
import { PageContext } from '../contexts/PageContext'

const LastfmLoginPage = () => {
  const env = import.meta.env
  const { setPageTitle } = useContext(PageContext)

  useEffect(() => {
    setPageTitle('')
  }, [setPageTitle])

  return <p>
    <Link href={`http://www.last.fm/api/auth/?api_key=${env.VITE_LASTFM_API_KEY}`}>Log in with Last.fm</Link>
  </p>
}

export default LastfmLoginPage
