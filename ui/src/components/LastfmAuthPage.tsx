import { useContext, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { PageContext } from '../contexts/PageContext'

const LastfmAuthPage = () => {
  const username = useLoaderData() as string
  const { setPageTitle } = useContext(PageContext)

  useEffect(() => {
    setPageTitle(`Last.fm ${username}`)
  }, [setPageTitle, username])

  return <div>
    Signed in as {username}
  </div>
}

export default LastfmAuthPage
