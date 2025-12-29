import { useContext, useEffect } from "react"
import IsLoading from "./IsLoading"
import { ContentContext } from "../store/content-context"
import PostItem from "./PostItem"

export default function PostsList(){
    const {posts} = useContext(ContentContext)
    const {postsData, postsIsLoading, postsIsError} = posts

    useEffect(()=>{

        if(postsIsError){      
            toast.error("Posts not found")
        }
        }, [ postsIsError])

    return <section className="w-full flex flex-col gap-4 bg-white rounded-2xl border py-4 border-gray-200">
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
}