import { ChatBubbleLeftRightIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"

import { useState } from 'react'

let url = import.meta.env.VITE_API_URL

export default function PrincipalComment({comment}){

    const [like, setLike] = useState(false)

    const [replyForm, setReplyForm] = useState(false)
    
    function showReplyForm(){
        setReplyForm(prev =>(!prev))
        
    }

    return <>
               
                <div className='flex justify-between mb-3 border-b border-gray-100 p-2'>
                    <div>
                        <div className='flex items-center gap-2'>
                            <figure className='size-8 rounded-full overflow-hidden'>
                                <img
                                    src={url + comment.users_img}
                                    className='object-cover size-full'
                                    alt="avatar" />
                            </figure>
                            <h6 className='font-semibold text-gray-950'>{comment.users_name + " " + comment.users_last_name}</h6>
                            <p className='text-gray-500 text-sm'>{new Date(comment.comments_date).toDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}</p>
                        </div>
                        <div >
                            <p className='text-gray-800 ml-2 mt-2'>{comment.comments_text}</p>
                        </div>
                        {/* <button className='flex items-center gap-1 mt-4 text-gray-800 hover:text-gray-950'
                                onClick={showReplyForm}
                                >
                            <ChatBubbleLeftRightIcon className='size-4'/>
                            <p>Reply</p>
                        </button> */}
                    </div>

                    {/* {<button onClick={()=>{setLike((prev) => !prev)}} className="flex items-center gap-1">
                        {like && <HeartIconSolid className="h-5 text-emerald-400"/>}
                        {!like && <HeartIcon className="h-5"/>}
                        <p className="font-semibold text-sm">9</p>
                    </button>} */}
                </div>
                {/* {replyForm && <form className='mx-5 mt-3'>
                    <textarea name="comment"
                            id="comment"
                            rows={1}
                            placeholder='Write a comment...'
                            className='w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 '
                            required
                    ></textarea>
                    
                    <div className='mt-1 flex justify-end'><button class="ml-auto rounded-full w-28 bg-emerald-500 px-3 py-0.5 text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400" fdprocessedid="lc39zr">Post reply</button></div>
                
                </form>} */}
                   
            </>
}