import { createHashRouter, Navigate, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LastfmLoginPage from './components/LastfmLoginPage'
import LastfmAuthPage from './components/LastfmAuthPage'
import LocalStorage, { lastfmUsernameKey } from './models/LocalStorage'

const PageRoutes = () => {
  const knownUsername = LocalStorage.get(lastfmUsernameKey)
  const router = createHashRouter(createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={
        typeof knownUsername === 'string' && knownUsername.trim().length > 0 ? (
          <Navigate replace to={`/lastfm/${encodeURIComponent(knownUsername)}`} />
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
      >
      </Route>
    </Route>
  ))
  return <RouterProvider router={router} />
}

export default PageRoutes
