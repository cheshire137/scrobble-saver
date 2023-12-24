import { useContext } from 'react'
import { createHashRouter, Navigate, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LastfmLoginPage from './components/LastfmLoginPage'
import LastfmAuthPage from './components/LastfmAuthPage'
import SpotifyAuthPage from './components/SpotifyAuthPage'
import { AuthContext } from './contexts/AuthContext'

const PageRoutes = () => {
  const { isSignedIntoLastfm, isSignedIntoSpotify } = useContext(AuthContext)

  const router = createHashRouter(createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={
        isSignedIntoLastfm ?
          isSignedIntoSpotify ? <Navigate replace to="/spotify" /> : <Navigate replace to="/lastfm" />
        : <LastfmLoginPage />
      } />
      <Route
        path="/lastfm"
        element={isSignedIntoSpotify ? <Navigate replace to="/spotify" /> : <LastfmAuthPage />}
      />
      <Route
        path="/spotify"
        element={isSignedIntoLastfm ? <SpotifyAuthPage /> : <Navigate replace to="/" />}
      />
    </Route>
  ))

  return <RouterProvider router={router} />
}

export default PageRoutes
