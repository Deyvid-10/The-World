import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import React, { useState }  from 'react'

export default function SecondaryComment(){

    const [like, setLike] = useState(false)

    return(
            <div className=' pb-5'>
                

                <div className='mx-5 mt-5 flex'>
                    <div>
                        <div className='flex items-center gap-2'>
                            <figure className='size-8 rounded-full overflow-hidden'>
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZtWBVfAYfadoSkWDVFTm_TdTD-8me4oTwog&s"
                                    className='object-cover w-full'
                                    alt="avatar" />
                            </figure>
                            <h6 className='font-semibold text-gray-950'>Deurys Marmolejo</h6>
                            <p className='text-gray-500'>Feb. 28, 2022</p>
                        </div>
                        <p className='mt-2 ml-1 text-gray-800'>Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy.</p>
                    </div>
                     {<button onClick={()=>{setLike((prev) => !prev)}} className="flex items-center gap-1">
                            {like && <HeartIconSolid className="h-5 text-emerald-400"/>}
                            {!like && <HeartIcon className="h-5"/>}
                        <p className="font-semibold text-sm">9</p>
                    </button>}
                </div>

            </div>
    )
}