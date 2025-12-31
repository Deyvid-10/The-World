
import { UserPlusIcon, ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"

import Comments from "./Comments"
import PrincipalComment from "./PrincipalComment"

import { useContext, useState } from "react"
import { ContentContext } from "../store/content-context"
import { Link } from "react-router-dom"

let backendUrl =  'http://localhost:3000/'

export default function PostItem({userName, userLastName, userImg, userId,postImg, postDate, postDescription, postLikes}){

    const [showComments, setShowComments] = useState(false)
    const [like, setLike] = useState(false)

    return(
        <section className="border-b pb-3 border-gray-100 mb-3">
            <div className="flex justify-between items-center px-4 mb-3">
                <div className="flex items-center gap-2">
                    <figure className="rounded-full size-8">
                        <img className="rounded-full size-full object-cover" src={backendUrl + userImg} alt={"profile photo for " + userName} />
                    </figure>
                    <Link to={"/profile/" + userId + "/posts"} className="text-gray-700 font-semibold">{userName + " " + userLastName}</Link>
                    <p className="text-gray-400">{new Date(postDate).toDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                {/* <UserPlusIcon className="size-6 text-gray-500 hover:text-gray-600"/> */}
                
            </div>
            {postImg && <figure className="overflow-hidden h-96 w-full bg-gray-300">
                <img src={backendUrl + postImg}
                    alt={"image post for " + userName}
                    className="size-full object-cover"
            
                    />
            </figure>}

            
                
            <p className="px-4 text-gray-600 mt-3">{postDescription}</p>
            <div className="px-4 flex gap-2 text-gray-500 mt-2">            
               
                {<button onClick={()=>{setLike((prev) => !prev)}} className="flex items-center gap-1">
                    {like && <HeartIconSolid className="h-7 text-emerald-400"/>}
                    {!like && <HeartIcon className="h-7"/>}
                    <p className="font-semibold">{postLikes}</p>
                </button>}
                <button onClick={()=>{setShowComments((prev) => !prev)}} className="flex items-center gap-1">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-7"/>
                    <p className="font-semibold">2</p>
                </button>
            </div>
                
            {
                showComments && 
                <div className="px-5"><Comments/></div>
            }

            
        </section>
    )
} 