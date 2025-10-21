import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import SignIn from './routes/SignIn.jsx'
import SignUp from './routes/SignUp.jsx'
import ShaderDemo from './routes/ShaderDemo.jsx'
import Root from './routes/Root.jsx'
import LandingPage from './components/LandingPage.jsx'
import Dashboard from './components/Dashboard.jsx'
import { AuthProvider } from './contexts/AuthContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <App /> },
      { path: 'landing', element: <LandingPage /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'shader-demo', element: <ShaderDemo /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
