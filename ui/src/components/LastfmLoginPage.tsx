import { Link } from '@primer/react'

const LastfmLoginPage = () => {
  const env = import.meta.env
  return <p>
    <Link href={`http://www.last.fm/api/auth/?api_key=${env.VITE_LASTFM_API_KEY}`}>Log in with Last.fm</Link>
  </p>
}

export default LastfmLoginPage
