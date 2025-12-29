import PostItem from "../components/PostItem"

import GeneralStructure from "../components/GeneralStructure"
import PostsList from "./PostsList"
import { useContext, useEffect } from "react"
import { SesionContext } from "../store/sesion-context"
import { useParams } from "react-router-dom"
import { ContentContext } from "../store/content-context"
import IsLoading from "./IsLoading"

export default function Profile(){
    const {userId} = useParams()
    const { userProfile } = useContext(ContentContext)
    const { userProfileData, userProfileIsLoading, userProfileIsError, userProfileRefetch } = userProfile(userId)
    
    useEffect(()=>{
        userProfileRefetch()
    }, [userId])
    
    return(
        <GeneralStructure>
            {userProfileIsLoading && <IsLoading/>}
            {userProfileData && <section className="max-w-[1000px] flex flex-col gap-4 bg-white rounded-2xl border py-4 border-gray-200">
                <div className="flex gap-5 items-center justify-between mx-auto">
                    <figure className="overflow-hidden rounded-full size-40 bg-emerald-600">
                        <img 
                            src={ userProfileData[0].users_img} 
                            alt={"Profile photo for" + userProfileData[0].users_name}
                            className="object-cover size-full"/>
                    </figure>
                    <div className="flex flex-col gap-2">
                        <div className="">
                            <h2 className="font-semibold text-lg">{userProfileData[0].users_name + " " + userProfileData[0].users_last_name}</h2>
                            <button className="rounded-full text-sm bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Edit profile</button>
                        </div>
                        <div className="flex gap-5">
                            <p>0 Posts</p>
                            <p>0 Followers</p>
                            <p>0 Followed</p>
                        </div>
                        <p className="text-gray-600">I'm the world</p>
                    </div>
                </div>

                <PostsList></PostsList>
            </section>}
        </GeneralStructure>
    )
}