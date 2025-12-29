import { useContext, useEffect } from "react"
import { ContentContext } from "../store/content-context"
import { useSearchParams } from "react-router-dom"
import { queryClient } from "../util/requests"
import IsLoading from "./IsLoading"


export default function ({suggestion = false, ...props}){
    
    const [searchParams] = useSearchParams()
    let userToShow = searchParams.get("searchUser")
    if(suggestion){userToShow = "*****suggestions*****"}
    const {users} = useContext(ContentContext)
    console.log(userToShow);
    

    const {usersData, usersIsLoading, usersIsError, usersRefetch} = users(userToShow)
    
    useEffect(()=>{
        if(userToShow !== "*****suggestions*****"){
            usersRefetch()
        }
        
    }, [userToShow])
    
    return(
        <ul {...props}>
            {usersIsLoading && <IsLoading/>}
            {!usersData && <p className="text-center col-start-2">Profile have not been found</p>}
            {usersData &&  usersData.map((user, index)=>(
                <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <figure className="rounded-full size-8">
                            <img className="size-full rounded-full object-cover" src={user.users_img} alt={"Profile photo for user " + user.users_name} />
                        </figure>
                        <p className="text-gray-700 font-semibold">{user.users_name + " " + user.users_last_name}</p>
                    </div>
                    <button disabled={usersIsLoading} className="rounded-full text-sm bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Follow</button>
                </li>
            ))}

            
        </ul>
    )
}