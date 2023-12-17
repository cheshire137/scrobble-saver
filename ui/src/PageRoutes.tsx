import { createHashRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LastfmLoginPage from './components/LastfmLoginPage'

const PageRoutes = () => {
  const router = createHashRouter(createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<LastfmLoginPage />} />
    </Route>
  ))
  return <RouterProvider router={router} />
}

export default PageRoutes
