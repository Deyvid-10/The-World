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
import { useRef } from 'react'

export default function UserForm({createAccount = false, editProfile = false}){

  const redirect = useNavigate()

  const { user } = useContext(SesionContext)

  const { data, isLoading, isSuccess } = user
  
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
        queryClient.invalidateQueries({queryKey: ['posts']})
        queryClient.invalidateQueries({queryKey: ['users']})
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
    // const data = Object.fromEntries(fd.entries())
    // createAccount || editProfile ? data.avatar = avatar : undefined
    // fd.append("img", data.profilePhoto)
    
    mutate({formData: fd, 
          type:  editProfile ? 'editProfile' : createAccount ? 'signup' : 'login',
          method: editProfile ? 'PUT' : 'POST'
    })
    
  }

  const profileRef = useRef()

  function handleProfilePhoto(){
    profileRef.current.click()
  }  
  
  const [profilePhoto, setProfilePhoto] = useState(`http://localhost:3000/img/profiles/default_profile_photo.webp`)
  useEffect(()=>{
    if(data){
      setProfilePhoto(`http://localhost:3000${data[0].users_img}`)
      console.log(data);
      
    }
  }, [data])
  function getProfileImg(e){
    const file = e.target.files[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        setProfilePhoto(event.target.result); 
    };
    reader.readAsDataURL(file);
  }
  
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
          {(createAccount || editProfile) && <div>
            <div className='mb-2 mx-auto size-50 rounded-full'>
              <img className='size-full mx-auto object-cover rounded-full' src={profilePhoto} alt="profile photo"/>
            </div>
            <button accept="image/*" onChange={getProfileImg} onClick={handleProfilePhoto} className='text-center block text-sm/6 font-medium text-gray-700 w-full mb-5 hover:text-gray-800'>Edit profile photo</button>
          </div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input ref={profileRef} onChange={getProfileImg} className='hidden' type="file" name="profilePhoto" id="profilePhoto" />
            {(createAccount || editProfile) && 
            <div className='block sm:flex sm:space-y-0 space-y-6 gap-2 justify-between'>
                <Input label={"Name"} name="name" type={"text"} defaultValue={data?.[0]?.users_name}/>
                <Input label={"Last Name"} name="last-name" type={"text"} defaultValue={data?.[0]?.users_last_name}/>
            
            </div>}
            <Input label={"Email address"} name="email" type={"text"} defaultValue={data?.[0]?.users_email}/>
            <Input label={"Password"} name="password" type={"password"} />
            {(createAccount || editProfile) && <Input label={"Confirm Password"} name="conf-password" type={"password"}  />}
            {(createAccount || editProfile) && <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Info
              </label>
              <div className="mt-2">
                <textarea defaultValue={data?.[0]?.users_bio} name="bio" className='w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600'></textarea>
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

    </section>
  )


}