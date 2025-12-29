import { useState } from 'react'
import './App.css'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import MainNavigation from './components/MainNavigation'
import Profile from './components/Profile'

import HomePage from './pages/HomePage'
import ProfilesPage from './pages/ProfilesPage'
import ChatsPage from './pages/ChatsPage'
import ErrorsPage from './pages/ErrorsPage'
import LogInPage from './pages/LogInPage'
import SignUpPage from './pages/SignUpPage'
import EditProfilePage from './pages/EditProfilePage'


import { queryClient } from './util/requests'
import { QueryClientProvider } from '@tanstack/react-query'
import SesionContextProvider from './store/sesion-context'
import ContentContextProvider from './store/content-context'
import { ToastContainer } from 'react-toastify'

const router = createBrowserRouter([{
   path: '/',
    element: <MainNavigation/>,
    errorElement: <ErrorsPage/>,
    children: [
      {index: true, element:<HomePage />},
      {path:'profile/:userId', element:<Profile />},
      {path:'search-profiles', element:<ProfilesPage />},
      {path:'chats', element:<ChatsPage />},
    ]},
  
    {path:"/log-in", element: <LogInPage/>},
    {path:"/sign-up", element: <SignUpPage/>},
    {path:"/edit-profile", element: <EditProfilePage/>},
    
  ])

function App() {

  return (
    
    <QueryClientProvider client={queryClient}>
      <ContentContextProvider>
        <SesionContextProvider>
          <RouterProvider router={router}>
            <ToastContainer></ToastContainer>
          </RouterProvider>
        </SesionContextProvider>
      </ContentContextProvider>
    </QueryClientProvider>
  )
}

export default App
