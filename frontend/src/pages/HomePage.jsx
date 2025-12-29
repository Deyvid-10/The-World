
import { PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline"

import PostItem from "../components/PostItem"

import GeneralStructure from "../components/GeneralStructure"
import { useContext, useEffect } from "react"
import { SesionContext } from "../store/sesion-context"
import { ContentContext } from "../store/content-context"
import IsLoading from "../components/IsLoading"

export default function HomePage(){

    const {user} = useContext(SesionContext)
    const {posts} = useContext(ContentContext)

    const {data: userData, isLoading: userIsLoanding, isError: isErrorUser} = user
    const {postsData, postsIsLoading, postsIsError} = posts
    console.log(postsData);
    
     useEffect(()=>{
        
        if(isErrorUser){      
          toast.error("User not found")
        }

        if(postsIsError){      
          toast.error("Posts not found")
        }
      }, [isErrorUser, postsIsError])
    return(
        <GeneralStructure>
            {/* post section */}
            {userData && <section className="flex flex-col gap-3 max-w-[1000px]">
                <section className="w-full bg-white rounded-2xl border p-4 border-gray-200">
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                        <img src={userData[0].users_img} alt={"Profile image for " + userData[0].Marmolejo} className="rounded-full size-14"/>
                        <input
                        id="seacrhItem"
                        name="seacrhItem"
                        type="text"
                        className="block rounded-xl w-[94%] text-xl text-gray-600 bg-gray-50 h-12 px-3 py-0.5 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6"
                        placeholder='Share your thoughts...'
                        />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1 text-gray-500">
                                <PhotoIcon className="size-5"/>
                                <p className="font-semibold ">Image</p>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                                <VideoCameraIcon className="size-5"/>
                                <p className="font-semibold ">Clip</p>
                            </div>
                        </div>
                        <button className="rounded-full text-lg bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Post</button>
                    </div>
                </section>
                
                <section className="w-full flex flex-col gap-4 bg-white rounded-2xl border py-4 border-gray-200">
                    {postsIsLoading && <IsLoading></IsLoading>}
                    {postsData && 
                    <div>
                        {postsData.map((data, index)=><PostItem 
                            key={index}
                            userName={data.users_name}
                            userLastName={data.users_last_name}
                            userImg={data.users_img}
                            postDate={data.posts_date}
                            postImg={data.posts_img}
                            postDescription={data.posts_description}
                            postLikes={data.posts_likes}
                            />)}
                    </div>}
                </section>
            </section>}
        </GeneralStructure>
    )
}