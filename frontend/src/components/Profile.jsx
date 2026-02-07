import PostItem from "../components/PostItem"

import GeneralStructure from "../components/GeneralStructure"
import PostsList from "./PostsList"
import { useContext, useEffect } from "react"
import { SesionContext } from "../store/sesion-context"
import { Link } from "react-router-dom"
import { ContentContext } from "../store/content-context"
import IsLoading from "./IsLoading"
import ProfilesList from "./ProfilesList"
import NewPost from "./NewPost"

let url = import.meta.env.VITE_API_URL

export default function Profile({profileContent, userId}){
    console.log(userId, "dasdass");
    
    const {user} = useContext(SesionContext)

    const {data: userData, isLoading: userIsLoanding, isError: isErrorUser} = user
    
    // const {userId} = useParams()
    const { userProfile, followUser, unfollowUser } = useContext(ContentContext)
    const { userProfileData, userProfileIsLoading, userProfileIsError, userProfileRefetch } = userProfile(userId)
    const {mutateFollow, followIsLoading, followIsError} = followUser
    const {mutateUnfollow, unfollowIsLoading, unfollowIsError} = unfollowUser
    
    function handleFollow(userId){
        mutateFollow(userId)
    }

    function handleUnfollow(userId){
        mutateUnfollow(userId)
    }

    useEffect(()=>{
        
        userProfileRefetch()

        return ()=>{
            console.log("Limpiando Profile de userId:", userId);

        }
    }, [userId])
    
    return(
        <GeneralStructure>
           
            {userProfileIsLoading && <IsLoading/>}
            {userProfileData && 
            <div>
                {userData && userId === "you" && 
                <section className="w-[800px] mb-3 flex flex-col gap-4 bg-white rounded-2xl border py-4 border-gray-200">
                    <NewPost userData={userData}></NewPost>
                </section>}
                <section className="w-[800px] flex flex-col gap-4 bg-white rounded-2xl border py-4 border-gray-200">
                
                    <div className="flex gap-5 items-center justify-between mx-auto">
                        <figure className="overflow-hidden rounded-full size-40 bg-emerald-600">
                            <img
                                src={url + userProfileData[0].users_img}
                                alt={"Profile photo for" + userProfileData[0].users_name}
                                className="object-cover size-full"/>
                        </figure>
                        <div className="flex flex-col gap-2">
                            <div className="">
                                <h2 className="font-semibold text-lg">{userProfileData[0].users_name + " " + userProfileData[0].users_last_name}</h2>
                                {userId === "you" && <Link to={"/edit-profile"} className="rounded-full text-sm bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Edit profile</Link>}
                                {(!userProfileData[0].followed && userId !== "you") && <button disabled={followIsLoading} onClick={()=>{handleFollow(userId)}} className="rounded-full text-sm bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Follow</button>}
                                {(userProfileData[0].followed && userId !== "you") && <button disabled={unfollowIsLoading}  onClick={()=>{handleUnfollow(userId)}} className="text-sm  py-0.5 font-semibold text-emerald-500 shadow-xs hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2">Followed</button>}
                            </div>
                            <div className="flex gap-5">
                                <Link to={`/profile/${userProfileData[0].users_id}/posts`}>{userProfileData[0].posts_quantity} Posts</Link>
                                <Link to={`/profile/${userProfileData[0].users_id}/followers`}>{userProfileData[0].followers_quantity} Followers</Link>
                                <Link to={`/profile/${userProfileData[0].users_id}/followed`}>{userProfileData[0].followed_quantity} Followed</Link>
                            </div>
                            <p className="text-gray-600">{userProfileData[0].users_bio}</p>
                        </div>
                    </div>
                
                    {profileContent === "post" && <PostsList postsData={userProfileData[0].users_posts} postsIsLoading={userProfileIsLoading} style="border-t border-gray-200 pt-5 max-w-[800px]"></PostsList>}
                    {profileContent === "follower" && <ProfilesList usersData={userProfileData[0].users_followers} className="flex flex-col gap-5 pt-3 px-5 w-150 border-t border-gray-100"></ProfilesList>}
                    {profileContent === "followed" && <ProfilesList usersData={userProfileData[0].users_followed} className="flex flex-col gap-5 pt-3 px-5 w-150 border-t border-gray-100"></ProfilesList>}
                </section>
            </div>}
        </GeneralStructure>
    )
}