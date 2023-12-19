import { useContext } from 'react'
import { createHashRouter, Navigate, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LastfmLoginPage from './components/LastfmLoginPage'
import LastfmAuthPage from './components/LastfmAuthPage'
import SpotifyAuthPage from './components/SpotifyAuthPage'
import { AuthContext } from './contexts/AuthContext'

const PageRoutes = () => {
  const { lastfmUsername, spotifyUserId, isSignedIntoLastfm, isSignedIntoSpotify } = useContext(AuthContext)
  const lastfmPath = `/lastfm/${encodeURIComponent(lastfmUsername)}`
  const lastfmSpotifyPath = `${lastfmPath}/spotify/${encodeURIComponent(spotifyUserId)}`

  const router = createHashRouter(createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={
        isSignedIntoLastfm ?
          isSignedIntoSpotify ? <Navigate replace to={lastfmSpotifyPath} /> : <Navigate replace to={lastfmPath} />
        : <LastfmLoginPage />
      } />
      <Route
        path="/lastfm/:username"
        element={isSignedIntoSpotify ? <Navigate replace to={lastfmSpotifyPath} /> : <LastfmAuthPage />}
      />
      <Route
        path="/spotify/:id"
        element={isSignedIntoLastfm ? <Navigate replace to={lastfmSpotifyPath} /> : <Navigate replace to="/" />}
      />
      <Route
        path="/lastfm/:username/spotify/:id"
        element={<SpotifyAuthPage />}
      />
    </Route>
  ))

  return <RouterProvider router={router} />
}

export default PageRoutes
