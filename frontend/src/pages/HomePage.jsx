
import { PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline"

import PostItem from "../components/PostItem"

import GeneralStructure from "../components/GeneralStructure"
import { useContext, useEffect, useRef, useState } from "react"
import { SesionContext } from "../store/sesion-context"
import { ContentContext } from "../store/content-context"
import PostsList from "../components/PostsList"

export default function HomePage(){
    const {posts} = useContext(ContentContext)
    const {postsData, postsIsLoading, postsIsError} = posts

    useEffect(()=>{

        if(postsIsError){      
            toast.error("Posts not found")
        }
        }, [ postsIsError])
    const [toUploadImg, setToUploadImg] = useState("");

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

    function getImage(e){
        const file = e.target.files[0];
        
        
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setToUploadImg(event.target.result); 
        };
        reader.readAsDataURL(file);
    }
    
    return(
        <GeneralStructure>
            {/* post section */}
            {userData && <section className="flex flex-col gap-3 max-w-[800px]">
                <section className="w-full bg-white rounded-2xl border p-4 border-gray-200">
                    <div className="flex items-center gap-2 ">
                        <img src={userData[0].users_img} alt={"Profile image for " + userData[0].Marmolejo} className="rounded-full size-14"/>
                        <input
                        id="seacrhItem"
                        name="seacrhItem"
                        type="text"
                        className="block rounded-xl w-[94%] text-xl text-gray-600 bg-gray-50 h-12 px-3 py-0.5 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6"
                        placeholder='Share your thoughts...'
                        />
                    </div>

                    
                    {toUploadImg && <img className="mx-auto mt-2" src={toUploadImg}></img>}

                    <div className="flex justify-between items-center mt-3 border-t border-gray-200 pt-3">
                        <div className="flex gap-4">
                            <button onClick={handleUploadImage} className="flex items-center gap-1 text-gray-500">
                                <input className="hidden" accept="image/*" type="file" onChange={getImage} ref={uploadImage}/>
                                <PhotoIcon className="size-5"/>
                                <p className="font-semibold ">Image</p>
                            </button>
                            <div className="flex items-center gap-1 text-gray-500">
                                <VideoCameraIcon className="size-5"/>
                                <p className="font-semibold ">Clip</p>
                            </div>
                        </div>
                        <button className="rounded-full text-lg bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Post</button>
                    </div>
                </section>
                
                <PostsList postsData={postsData} postsIsLoading={postsIsLoading} style="w-full flex flex-col gap-4 bg-white rounded-2xl border py-4 border-gray-200"></PostsList>
            </section>}
        </GeneralStructure>
    )
}