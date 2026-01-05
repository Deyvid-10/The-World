
import { UserPlusIcon, ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"

import Comments from "./Comments"
import PrincipalComment from "./PrincipalComment"

import { useContext, useState } from "react"
import { ContentContext } from "../store/content-context"
import { Link } from "react-router-dom"
import { useEffect } from "react"

let backendUrl =  'https://the-world-jpsy.onrender.com/'

export default function PostItem({postId, userName, userLastName, userImg, userId,postImg, postDate, postDescription, likesQuantity, liked, commentQuantity}){

    const [showCommentsSection, setShowCommentsSection] = useState(false)
    const [commentQuantityState, setCommentQuantityState] = useState(commentQuantity)
    const {showComments, like, disLike} = useContext(ContentContext)
    // const [isLike, setIsLike] = likeState
    // const [thisLikesQuantity, setThisLikesQuantity] = likesQuantityState
    const {mutateLike, liekIsLoading, likeIsError} = like 
    const {mutateDisLike, disLikeIsLoading, disLikeIsError} = disLike
    
    const [isLike, setIsLike] = useState(liked)
    const [thisLikesQuantity, setThisLikesQuantity] = useState(likesQuantity)
    
    
    useEffect(()=>{
        
        if(likeIsError){            
            
        }
        if(disLikeIsError){            
            
        }
    }, [likeIsError, disLikeIsError])
    
    function handleLike(){
        mutateLike(postId, {onSuccess: () => {
            setIsLike(1)
            setThisLikesQuantity((prev)=> prev+1)
        },
        onError: (error) => {
            setIsLike(0)
            setThisLikesQuantity((prev)=> prev-1)
        }})
        
        
    }

    function handleDisLike(){
        mutateDisLike(postId, {onSuccess: () => {
            setIsLike(0)
            setThisLikesQuantity((prev)=> prev-1)
        },
        onError: (error) => {
            setIsLike(1)
            setThisLikesQuantity((prev)=> prev+1)
        }})
        
    }

    return(
        <section className="border-b pb-3 border-gray-100 mb-3">
            <div className="flex justify-between items-center px-4 mb-3">
                <div className="flex items-center gap-2">
                    <figure className="rounded-full size-8">
                        <img className="rounded-full size-full object-cover" src={backendUrl + userImg} alt={"profile photo for " + userName} />
                    </figure>
                    <Link to={"/profile/" + userId + "/posts"} className="text-gray-700 font-semibold">{userName + " " + userLastName}</Link>
                    <p className="text-gray-400">{new Date(postDate).toDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}</p>
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
                
                {<div className="flex items-center gap-1">
                    {isLike == 1 && <button onClick={handleDisLike}>
                        <HeartIconSolid className="h-7 text-emerald-400"/>
                    </button>}
                    {isLike == 0 && <button onClick={handleLike}>
                        <HeartIcon className="h-7"/>
                    </button>}
                    <p className="font-semibold">{thisLikesQuantity}</p>
                </div>}
                <button onClick={()=>{setShowCommentsSection((prev) => !prev)}} className="flex items-center gap-1">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-7"/>
                    <p className="font-semibold">{commentQuantityState}</p>
                </button>
            </div>
                
            {
                showCommentsSection && 
                <div className="px-5"><Comments postId={postId} setCommentQuantityState={setCommentQuantityState}/></div>
            }

            
        </section>
    )
} 