import { Avatar, Button, Link } from '@primer/react'
import { useEffect, useContext } from 'react'
import { PageContext } from '../contexts/PageContext'
import LastfmLogo from '../assets/lastfm64x64.png'

const LastfmLoginPage = () => {
  const env = import.meta.env
  const { setPageTitle } = useContext(PageContext)

  useEffect(() => {
    setPageTitle('')
  }, [setPageTitle])

  return <>
    <p>
      Sign in with Last.fm to see your most listened to and loved tracks.
    </p>
    <Button
      size="large"
      as={Link}
      sx={{ backgroundColor: 'lastfm.bg', color: 'white', ':hover': { backgroundColor: 'lastfm.bgHover' } }}
      href={`http://www.last.fm/api/auth/?api_key=${env.VITE_LASTFM_API_KEY}`}
    >
      <Avatar
        sx={{ mr: 2, display: 'inline-block', verticalAlign: 'middle', boxShadow: 'none' }}
        size={32}
        src={LastfmLogo}
      />
      Log in with Last.fm
    </Button>
  </>
}

export default LastfmLoginPage
