
import { UserPlusIcon, ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"

import Comments from "./Comments"
import PrincipalComment from "./PrincipalComment"

import { useState } from "react"

export default function PostItem(){

    const [showComments, setShowComments] = useState(false)
    const [like, setLike] = useState(false)

    return(
        <>
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-amber-400 size-8"></div>
                    <p className="text-gray-700 font-semibold">Deyvid Marmolejo</p>
                    <p className="text-gray-400">Jun 11, 2025</p>
                </div>
                <UserPlusIcon className="size-6 text-gray-500 hover:text-gray-600"/>
                
            </div>
            <figure className="overflow-hidden h-96 w-full bg-gray-300">
                <img src="https://i.blogs.es/60de22/mejores-animes-crunchyroll/1366_2000.jpeg"
                    alt=""
                    className="size-full object-cover"
            
                    />
            </figure>
                
            <p className="px-4 text-gray-600">No dejamos de hacer ejercicio porque envejecemos, envejecemos porque dejamos de hacer ejercicio". 🛼🚴 Como me quito el estrés</p>
            <div className="px-4 flex gap-2 text-gray-500 mt-2">            
               
                {<button onClick={()=>{setLike((prev) => !prev)}} className="flex items-center gap-1">
                    {like && <HeartIconSolid className="h-7 text-emerald-400"/>}
                    {!like && <HeartIcon className="h-7"/>}
                    <p className="font-semibold">9</p>
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

            <span className="w-[98%] mx-auto border border-gray-100 px-4"></span>
        </>
    )
} 