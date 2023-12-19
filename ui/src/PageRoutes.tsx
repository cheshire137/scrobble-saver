import { createHashRouter, Navigate, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LastfmLoginPage from './components/LastfmLoginPage'
import LastfmAuthPage from './components/LastfmAuthPage'
import SpotifyAuthPage from './components/SpotifyAuthPage'
import LocalStorage, { lastfmUsernameKey, spotifyUserIdKey } from './models/LocalStorage'

const PageRoutes = () => {
  const lastfmUsername = LocalStorage.get(lastfmUsernameKey) ?? ''
  const spotifyUserId = LocalStorage.get(spotifyUserIdKey) ?? ''
  const isSignedInWithLastfm = lastfmUsername.trim().length > 0
  const isSignedInWithSpotify = spotifyUserId.trim().length > 0
  const lastfmPath = `/lastfm/${encodeURIComponent(lastfmUsername)}`
  const lastfmSpotifyPath = `${lastfmPath}/spotify/${encodeURIComponent(spotifyUserId)}`

  const router = createHashRouter(createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={
        isSignedInWithLastfm ?
          isSignedInWithSpotify ? <Navigate replace to={lastfmSpotifyPath} /> : <Navigate replace to={lastfmPath} />
        : <LastfmLoginPage />
      } />
      <Route
        path="/lastfm/:username"
        element={isSignedInWithSpotify ? <Navigate replace to={lastfmSpotifyPath} /> : <LastfmAuthPage />}
        loader={async ({ params }) => {
          const lastfmUsername = params.username
          LocalStorage.set(lastfmUsernameKey, lastfmUsername)
          return lastfmUsername
        }}
      />
      <Route
        path="/spotify/:id"
        element={isSignedInWithLastfm ? <Navigate replace to={lastfmSpotifyPath} /> : <Navigate replace to="/" />}
        loader={async ({ params }) => {
          const spotifyUserId = params.id
          LocalStorage.set(spotifyUserIdKey, spotifyUserId)
          return spotifyUserId
        }}
      />
      <Route
        path="/lastfm/:username/spotify/:id"
        element={<SpotifyAuthPage />}
        loader={async ({ params }) => {
          const { username: lastfmUsername, id: spotifyUserId } = params
          LocalStorage.set(lastfmUsernameKey, lastfmUsername)
          LocalStorage.set(spotifyUserIdKey, spotifyUserId)
          return spotifyUserId
        }}
      />
      <Route
        path="/logout"
        element={<Navigate replace to="/" />}
        loader={async () => {
          LocalStorage.delete(lastfmUsernameKey)
          LocalStorage.delete(spotifyUserIdKey)
          return null
        }}
      />
    </Route>
  ))
  return <RouterProvider router={router} />
}

export default PageRoutes
