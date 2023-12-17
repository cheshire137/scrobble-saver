import { createHashRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LastfmLoginPage from './components/LastfmLoginPage'
import LastfmAuthPage from './components/LastfmAuthPage'

const PageRoutes = () => {
  const router = createHashRouter(createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<LastfmLoginPage />} />
      <Route
        path="/lastfm/:username"
        element={<LastfmAuthPage />}
        loader={async ({ params }) => {
          return params.username
        }}
      >
      </Route>
    </Route>
  ))
  return <RouterProvider router={router} />
}

export default PageRoutes
