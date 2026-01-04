
import { PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline"

import PostItem from "../components/PostItem"

import GeneralStructure from "../components/GeneralStructure"
import React, { useContext, useEffect, useRef, useState } from "react"
import { SesionContext } from "../store/sesion-context"
import { ContentContext } from "../store/content-context"
import PostsList from "../components/PostsList"
import { toast } from "react-toastify"

let url = 'http://localhost:3000/'

export default function HomePage(){
    const {posts, insertPost} = useContext(ContentContext)
    const {postsData, postsIsLoading, postsIsError} = posts
    const {mutatePost, postIsLoading, postIsError, postIsSuccess} = insertPost 


    useEffect(()=>{

        if(postsIsError){      
            toast.error("Posts not found")
        }
        }, [ postsIsError])
    const [toUploadImg, setToUploadImg] = useState(false);

    const {user} = useContext(SesionContext)

    const {data: userData, isLoading: userIsLoanding, isError: isErrorUser} = user

    useEffect(()=>{
        
        if(isErrorUser){      
          toast.error("User not found")
        }
      }, [isErrorUser])

    const uploadImage = useRef()

    function handleUploadImage(){
        uploadImage.current.click()  
    }
    const [upLoadImg, setUpLoadImg] = useState(null);
    const [thoughts, setThoughts] = useState("")
    const [errorMessage, setErrorMessage] = useState(false)

    function getImage(e){
        const file = e.target.files[0];
        setUpLoadImg(file)

        
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setToUploadImg(event.target.result); 
        };
        reader.readAsDataURL(file);
    }

    function getThoughts(e){
        setThoughts(e.target.value)
    }

    function handlePost(e){
        setErrorMessage(false)
        if(thoughts.length === 0){
            setErrorMessage(true)
            return
        }

        const formData =  new FormData();
        formData.append("thought", thoughts)
        formData.append("image", upLoadImg);
        
        mutatePost(formData)
    }

    useEffect(()=>{
        if(postIsSuccess){
            setThoughts("")
            setToUploadImg(false)  
        }
    }, [postIsSuccess])

    return(
        <GeneralStructure>
            {/* post section */}
            {userData && <div  className="flex flex-col gap-3 max-w-[800px]">
                <div className="w-full bg-white rounded-2xl border p-4 border-gray-200">
                    <div className="flex items-center gap-2 ">
                        <figure className="size-14"><img src={url + userData[0].users_img}  alt={"Profile image for " + userData[0].Marmolejo} className="rounded-full object-cover size-full"/></figure>
                        <input
                        onChange={getThoughts} value={thoughts}
                        type="text"
                        className="block rounded-xl w-[94%] text-xl text-gray-600 bg-gray-50 h-12 px-3 py-0.5 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6"
                        placeholder='Share your thoughts...'
                        />
                    </div>
                   {errorMessage && <p className="text-red-600 text-center">You must share a thought</p>}
                    
                    {toUploadImg && <img className="mx-auto mt-2" src={toUploadImg}></img>}

                    <div className="flex justify-between items-center mt-3 border-t border-gray-200 pt-3">
                        <div className="flex gap-4">
                            <button onClick={handleUploadImage} className="flex items-center gap-1 text-gray-500">
                                <input className="hidden" accept="image/*" type="file" onChange={getImage} ref={uploadImage}/>
                                <PhotoIcon className="size-5"/>
                                <p className="font-semibold ">Image</p>
                            </button>
                            {/* <div className="flex items-center gap-1 text-gray-500">
                                <VideoCameraIcon className="size-5"/>
                                <p className="font-semibold ">Clip</p>
                            </div> */}
                        </div>
                        <button onClick={handlePost} className="rounded-full text-lg bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Post</button>
                    </div>
                </div>
                
                <PostsList postsData={postsData} postsIsLoading={postsIsLoading} style="w-full flex flex-col gap-4 bg-white rounded-2xl border py-4 border-gray-200"></PostsList>
            </div>}
        </GeneralStructure>
    )
}