import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './pages/Landing'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import Skills from './pages/Skills'
import NewProject from './pages/NewProject'
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/landing', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/skills', element: <Skills /> },
  { path: '/projects/new', element: <NewProject /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
