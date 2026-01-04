
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"

import { ChatBubbleLeftRightIcon, HeartIcon } from '@heroicons/react/24/outline'
import React, { useState }  from 'react'

import PrincipalComment from "./PrincipalComment"

import SecondaryComment from "./SecondaryComment"
import { useContext } from "react"
import { ContentContext } from "../store/content-context"
export default function Comments({postId, setCommentQuantityState}){

    const {postComment, showComments} = useContext(ContentContext)
    const {mutateComment, commentAnswer, commentIsLoading, commentIsError} = postComment
    const {commentsData, commentsIsLoading, commentsIsError} = showComments(postId)

    function handlePostComment(event){
        event.preventDefault()
    
        const fd = new FormData(event.target)
        const commentFD =  {postId, ...Object.fromEntries(fd.entries())}
        
        mutateComment(commentFD, {onSuccess: () => {
                event.target.reset();
                setCommentQuantityState((prev)=>prev + 1)
            },
        }) 
        
        
    }
    
    return(
        <>
            <form onSubmit={handlePostComment} className='flex flex-col gap-3 mt-3'>
                <textarea name="comment" 
                        id="comment"
                        rows={3}
                        placeholder='Write a comment...'
                        className='w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-400 '
                        required
                ></textarea>
                {commentAnswer && "errors" in commentAnswer &&<p className='text-red-400'>- {commentAnswer.error}</p>}
                <button className="ml-auto rounded-full w-36 bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Post comment</button>
            </form>

            {commentsData && commentsData.map((comment, index)=>(
                <PrincipalComment key={comment.comments_id} comment={comment} />
            ))}
            {/* <SecondaryComment/> */}

        </>
    )
}