import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './pages/Landing'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import Skills from './pages/Skills'
import NewProject from './pages/NewProject'
import './index.css'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Settings from './pages/Settings'
import DeveloperSkills from './pages/DeveloperSkills'
import DesignSkills from './pages/DesignSkills'
import BothFlow from './pages/BothFlow'
import Nickname from './pages/Nickname'
import Tags from './pages/Tags'

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/home', element: <HomePage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/skills', element: <Skills /> },
  { path: '/developerskills', element: <DeveloperSkills /> },
  { path: '/designskills', element: <DesignSkills /> },
  { path: '/both', element: <BothFlow /> },
  { path: '/nickname', element: <Nickname /> },
  { path: '/tags', element: <Tags /> },
  { path: '/projects/new', element: <NewProject /> },
  { path: '/profile', element: <Profile /> },
  { path: '/search', element: <Search /> },
  { path: '/settings', element: <Settings /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
