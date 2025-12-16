import { useState } from 'react'
import './App.css'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import MainNavigation from './components/MainNavigation'
import Profile from './components/Profile'

import HomePage from './pages/HomePage'
import ProfilesPage from './pages/ProfilesPage'
import ChatsPage from './pages/ChatsPage'
import ErrorsPage from './pages/ErrorsPage'

const router = createBrowserRouter([{
   path: '/',
    element: <MainNavigation/>,
    errorElement: <ErrorsPage/>,
    children: [
      {index: true, element:<HomePage />},
      {path:'profile', element:<Profile />},
      {path:'search-profiles', element:<ProfilesPage />},
      {path:'chats', element:<ChatsPage />},
    ]
  
}])

function App() {

  return (
    <RouterProvider router={router}>
      
    </RouterProvider>
  )
}

export default App
