import React, { useEffect, useState } from "react";
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
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter([{
   path: '/',
    element: <MainNavigation/>,
    errorElement: <ErrorsPage/>,
    children: [
      {index: true, element:<HomePage />},
      {path:'profile/:userId/posts', element: <ProfilePage type="post"/>},
      {path:'profile/:userId/followers', element:<Profile profileContent={"follower"}/>},
      {path:'profile/:userId/followed', element:<Profile profileContent={"followed"}/>},
      {path:'search-profiles', element:<ProfilesPage />},
      {path:'chats/:userId', element:<ChatsPage />},
    ]},
  
    {path:"/log-in", element: <LogInPage/>},
    {path:"/sign-up", element: <SignUpPage/>},
    {path:"/edit-profile", element: <EditProfilePage/>},
    
  ])

function App() {
  

  return (

   

    
    <QueryClientProvider client={queryClient}>
      <SesionContextProvider>
        <ContentContextProvider>
            <ToastContainer />
              <RouterProvider router={router}>
            </RouterProvider>
        </ContentContextProvider>
      </SesionContextProvider>
    </QueryClientProvider>

    
  )
}

export default App
