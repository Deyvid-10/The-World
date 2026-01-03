import { useContext, useEffect } from "react"
import IsLoading from "./IsLoading"
import { ContentContext } from "../store/content-context"
import PostItem from "./PostItem"
import { useState } from "react"

export default function PostsList({style, postsData, postsIsLoading, emptyMessage}){
    
    
    
    return <section className={style}>
        {postsIsLoading && <IsLoading></IsLoading>}
        {postsData && postsData.length === 0 && <p className="text-center font-semibold w-170">There is not posts in this profile</p>}
        {postsData && postsData.length !== 0 && 

        <div>
            {postsData.map((data, index)=><PostItem
                key={index}
                postId={data.posts_id}
                userName={data.users_name}
                userLastName={data.users_last_name}
                userImg={data.users_img}
                postDate={data.posts_date}
                postImg={data.posts_img}
                postDescription={data.posts_description}
                postLikes={data.posts_likes}
                userId={data.users_id}
                commentQuantity={data.comments_quantity}
                />)}
        </div>}
    </section>
}