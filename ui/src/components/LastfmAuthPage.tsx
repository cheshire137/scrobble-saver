import { useContext, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { PageContext } from '../contexts/PageContext'
import { LastfmTopTracksContextProvider } from '../contexts/LastfmTopTracksContext'
import LastfmTopTracks from './LastfmTopTracks'

const LastfmAuthPage = () => {
  const username = useLoaderData() as string
  const { setPageTitle } = useContext(PageContext)

  useEffect(() => {
    setPageTitle(`Signed in as ${username}`)
  }, [setPageTitle, username])

  return <LastfmTopTracksContextProvider user={username}>
    <LastfmTopTracks />
  </LastfmTopTracksContextProvider>
}

export default LastfmAuthPage
