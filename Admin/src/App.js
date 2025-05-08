import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import MinimalLayout from './layout/MinimalLayout'
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const PublicRoute = () => {
    return isAuthenticated || Boolean(Cookies.get('token')) ? (
      <Navigate to="/dashboard" />
    ) : (
      <MinimalLayout />
    )
  }

  const PrivateRoute = () => {
    return isAuthenticated || Boolean(Cookies.get('token')) ? (
      <DefaultLayout />
    ) : (
      <Navigate to="/" />
    )
  }
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route exact path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="*" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
