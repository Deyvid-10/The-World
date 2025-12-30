import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import Input from './Input'
import IsLoading from './IsLoading'


import { credentials, queryClient } from '../util/requests'
import { SesionContext } from '../store/sesion-context'
import { useContext } from 'react'
import { useState } from 'react'

export default function UserForm({createAccount = false, editProfile = false}){

  const redirect = useNavigate()

  const { user } = useContext(SesionContext)

  const { data, isLoading, isSuccess } = user
  console.log(data);
  
  useEffect(()=>{
    if(data && !editProfile){
      redirect("/")      
    }

    if(isSuccess && !data && editProfile){
      redirect("/")      
    }

  }, [data])
  
  const {mutate, data: response, isPending} = useMutation(
    {
      mutationFn: credentials,
      mutationKey: [editProfile ? 'edit-profile' : createAccount ? 'signup' : 'login'],
      onSuccess: (data) => {
          
        queryClient.invalidateQueries({queryKey: ['user']})
        if(editProfile && data.error){
          toast.error(data.error)
        }
        else if(editProfile && data.message){
          toast.success(data.message)
        }
      },
      onError: () =>{

        if(createAccount){
          toast.error('Error to signup, try later')
        }
        else if(editProfile){
          toast.error('Error to edit profile, try later')
        }
        else{
          toast.error('Error to login, try later')
        }
      }
    }
  )

  function handleSubmit(event){
    
    event.preventDefault()
    
    const fd = new FormData(event.target)
    // let avatar = ''
    
    
    // createAccount || editProfile ? avatar = fd.getAll('avatar') : undefined
    const data = Object.fromEntries(fd.entries())
    // createAccount || editProfile ? data.avatar = avatar : undefined
    
    
    mutate({formData: data, 
          type:  editProfile ? 'editProfile' : createAccount ? 'signup' : 'login',
          method: editProfile ? 'PUT' : 'POST'
    })
    
  }
  
  const [avatarIndex, setAvatarIndex] = useState(1)

  // useEffect(()=>{
    
  //   if(data && editProfile){
  //     setAvatarIndex(avatars.findIndex((avatar) => avatar.img === data[0].users_img))
  //   }
  //   else{
  //     setAvatarIndex(0)
  //   }
    
  // }, [data])
  
  return (
    <section className={(createAccount || editProfile) ? 'flex flex-row-reverse m-auto h-screen' : "flex"}>
      <div className={(createAccount || editProfile) ? " md:w-[550px] w-full flex flex-col m-auto px-6 lg:px-8  py-12" : 
                                              "min-h-full md:w-[550px] w-full flex  flex-col px-6 lg:px-8  justify-center m-auto h-screen" }>
        {/* logo form */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to="/">
            <p className='font-bold text-3xl logoText text-center'>The <span className='text-emerald-500'>World</span></p>
          </Link>
          <h2 className="mt-5 text-center text-xl/9 font-semibold  text-gray-900">
            { editProfile ? "Edit " : createAccount ? "Sign up to" : "Log in to"}  your account
          </h2>
        </div>

        <div className={(createAccount || editProfile) ? "shadow border bg-white border-gray-100 p-5 rounded-2xl mt-7 sm:mx-auto sm:w-full max-w-full sm:max-w-md md:max-w-full" 
                                      : "shadow border bg-white border-gray-100 p-5 rounded-2xl mt-7 sm:mx-auto sm:w-full sm:max-w-sm"}>
          <form onSubmit={handleSubmit} className="space-y-6">
           
            {(createAccount || editProfile) && 
            
            <div className='block sm:flex sm:space-y-0 space-y-6 gap-2 justify-between'>
                <Input label={"Name"} name="name" type={"text"} defaultValue={data?.[0]?.users_name}/>
                <Input label={"Last Name"} name="last-name" type={"text"} defaultValue={data?.[0]?.users_last_name}/>
            
            </div>}
            <Input label={"Email address"} name="email" type={"email"} defaultValue={data?.[0]?.users_email}/>
            <Input label={"Password"} name="password" type={"password"} />
            {(createAccount || editProfile) && <Input label={"Confirm Password"} name="conf-password" type={"password"}  />}
            {(createAccount || editProfile) && <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Info
              </label>
              <div className="mt-2">
                <textarea name="bio" className='w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600'></textarea>
              </div>
            </div>}
            {response && "errors" in response &&
              <ul>
                {response.errorsList.map((err, index) => (
                  <div>
                    <li key={index} className='text-red-400'>- {err}</li>
                  </div>
                ))}
              </ul>
            }
            <div>
              <button
                type="submit"
                className="flex w-full h-10 justify-center rounded-md bg-emerald-500 px-3 py-1.5 text-sm/6 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xs hover:transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isPending || isLoading}
              >
                {isPending ? <IsLoading/> : editProfile ? "Edit account" : createAccount ? "Sign up" : "Log in"}
                
              </button>
            </div>
          </form>

          {!editProfile && <p className="mt-10 text-center text-sm/6 text-gray-500">
            {createAccount ? "Do you have an account already? " : "Don't you have a account? "}
            <Link to = {createAccount ? "/log-in": "/sign-up"} className="font-semibold text-emerald-600 hover:text-emerald-600 hover:transition-colors">
              {createAccount ? "Click here to log in" : "Click here to sign up" }
            </Link>
          </p>}
        </div>

      </div>

      {/* <div className="w-full h-dvh flex-1">
        <img 
        src={editProfile ? front_page_home : createAccount ? front_page_cloth : front_page_tech}
        className=" w-full h-full brightness-75 object-cover" alt="Front page" />
        
      </div> */}

    </section>
  )


}