


import PostItem from "../components/PostItem"

import GeneralStructure from "../components/GeneralStructure"
import React, { useContext, useEffect, useRef, useState } from "react"
import { SesionContext } from "../store/sesion-context"
import { ContentContext } from "../store/content-context"
import PostsList from "../components/PostsList"
import { toast } from "react-toastify"

let url = import.meta.env.VITE_API_URL

export default function HomePage(){
    const {posts} = useContext(ContentContext)
    const {postsData, postsIsLoading, postsIsError} = posts
    
    const {user} = useContext(SesionContext)

    const {data: userData, isLoading: userIsLoanding, isError: isErrorUser} = user
    useEffect(()=>{

    if(postsIsError){      
        toast.error("Posts not found")
    }
    }, [ postsIsError])

    useEffect(()=>{
        
        if(isErrorUser){      
          toast.error("User not found")
        }
      }, [isErrorUser])

    return(
        <GeneralStructure>
            {/* post section */}
            {userData && <div  className="flex flex-col gap-3 w-[800px]">
                
                
                <PostsList postsData={postsData} postsIsLoading={postsIsLoading} style="w-full flex flex-col gap-4 bg-white rounded-2xl border py-4 border-gray-200"></PostsList>
            </div>}
        </GeneralStructure>
    )
}