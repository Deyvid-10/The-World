
import React from 'react';

import Search from './Search';
// import logo from '../assets/img/LOGO.png'

import {Link} from 'react-router-dom'

import { useState } from 'react'
import NotificationItem from './NotificationItem';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems 
} from '@headlessui/react'
import { UserIcon, ChatBubbleLeftEllipsisIcon, BellIcon  } from '@heroicons/react/24/outline'

export default function MainNavBar() {
  const [isLogIn, setIsLogIn] = useState(true)

  return (
    <div className="bg-white">



      <header className="relative bg-white">
        <nav className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex justify-evenly h-14 items-center">
              {/* Logo */}
              <div className="flex ">
                <Link to="/" className='flex items-center '>
                  {/* <img
                    alt="logo company"
                    src={logo}
                    className=" w-12"
                  /> */}
                  <p className='font-bold text-2xl'>The <span className='text-emerald-500'>World</span></p>                </Link>
              </div>

            
              {/* Search */}

              <Search className="relative hidden mx-auto items-center w-[450px] lg:w-[500px] mr-4 md:block"/>

              {/* Function icons */}
              <div className="ml-auto flex items-center ">


                {/* User options */}

                {!isLogIn &&       
                <div className=''>              
                  <Link to="sign-up" className="rounded-full bg-emerald-500 px-3 py-2 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">
                    Sign up
                  </Link>
              
                  {/* <span aria-hidden="true" className="h-6 w-px bg-gray-200 " /> */}
            
                  <Link to="log-in" className="font-medium text-gray-500 hover:text-gray-800 px-3 py-1.5">
                    Log in
                  </Link>
                </div>}

                {/* Loged options */}
                {isLogIn && 
                <section className='flex'>
                  {/* User */}
                  <Menu as="div"   className="relative ">
                    <MenuButton className="p-2 hover:cursor-pointer">
                      <UserIcon aria-hidden="true"
                            className="size-7 shrink-0 text-gray-400 hover:text-gray-500 "/>
                  
                      {/* <img className='size-7 rounded-lg border-3 border-indigo-600' src="https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Destiny" alt="profile photo" /> */}
                    </MenuButton>
                      <MenuItems
                        transition
                        className="absolute w-96 right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                      >
                        <div className='flex w-96 flex-col rounded-md bg-white shadow-2xl  transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in p-4'>
                  
                            <MenuItem>
                              <Link to="" className="">
                                <div className='flex items-center p-2 gap-2'>
                                  <div className='rounded-full bg-amber-300 size-9'></div>
                                  <p className='font-semibold text-lg'>Deyvid Marmolejo</p>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link to="" className="text-sm  text-gray-700 hover:text-gray-800 px-3 py-1.5">
                                Edit profile
                              </Link>
                            </MenuItem>
                            <span aria-hidden="true" className="w-full h-0.5 bg-gray-200 " />
                            <MenuItem>
                              <Link to="log-in" className="text-sm text-gray-700 hover:text-gray-800 px-3 py-1.5">
                                Log Out
                              </Link>
                            </MenuItem>
                            {/* <MenuItem>
                              <a href="#" className="text-sm rounded-md bg-indigo-600 px-3 py-1.5 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Edit profile
                              </a>
                            </MenuItem> */}
                        </div>
                  
                      </MenuItems>
                  </Menu>
        
                  {/* Notificacons */}
                  <Menu as="div"   className="relative ">
                      <MenuButton className="relative p-2 hover:cursor-pointer">
                        <BellIcon aria-hidden="true"
                              className="size-7 shrink-0 text-gray-400 hover:text-gray-500 "/>
                        <span className='absolute top-0 left-1 size-5 text-sm bg-red-600 rounded-full text-white'>1</span>
                      </MenuButton>
                      <MenuItems
                        transition
                        className="absolute w-96 right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                      >
                        <div className='flex w-96 flex-col rounded-md bg-white shadow-2xl  transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in p-4'>
                            
                            <MenuItem>
                              <NotificationItem/>
                            </MenuItem>
                           
                        </div>
                  
                      </MenuItems>
                  </Menu>
                   <div className="relative p-2 hover:cursor-pointer">
                      <ChatBubbleLeftEllipsisIcon aria-hidden="true"
                            className="size-7 shrink-0 text-gray-400 hover:text-gray-500 "/>
                      <span className='absolute top-0 left-1 text-center size-5 text-sm bg-red-600 rounded-full text-white'>1</span>
                    </div>
                </section>
                }
              </div>
            </div>

            <Search className="relative md:hidden items-center w-full mb-2"/>
          </div>

          
        </nav>
      </header>
    </div>
  )
}
