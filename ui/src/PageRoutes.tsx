import { createHashRouter, Navigate, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LastfmLoginPage from './components/LastfmLoginPage'
import LastfmAuthPage from './components/LastfmAuthPage'
import LocalStorage, { lastfmUsernameKey } from './models/LocalStorage'

const PageRoutes = () => {
  const lastfmUsername = LocalStorage.get(lastfmUsernameKey)
  const router = createHashRouter(createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={
        typeof lastfmUsername === 'string' && lastfmUsername.trim().length > 0 ? (
          <Navigate replace to={`/lastfm/${encodeURIComponent(lastfmUsername)}`} />
        ) : (
          <LastfmLoginPage />
        )
      } />
      <Route
        path="/lastfm/:username"
        element={<LastfmAuthPage />}
        loader={async ({ params }) => {
          const username = params.username
          LocalStorage.set(lastfmUsernameKey, username)
          return username
        }}
      />
      <Route
        path="/logout"
        element={<Navigate replace to="/" />}
        loader={async () => {
          LocalStorage.delete(lastfmUsernameKey)
          return null
        }}
      />
    </Route>
  ))
  return <RouterProvider router={router} />
}

export default PageRoutes
