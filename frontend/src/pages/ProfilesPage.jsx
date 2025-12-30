import { useSearchParams } from "react-router-dom"
import ProfilesList from "../components/ProfilesList"
import { ContentContext } from "../store/content-context"
import { useContext } from "react"
import { useEffect } from "react"

export default function ProfilesPage(){
    const [searchParams] = useSearchParams()
    let userToShow = searchParams.get("searchUser")
    const {users} = useContext(ContentContext)
    
    const {usersData, usersIsLoading, usersIsError, usersRefetch} = users(userToShow)

    useEffect(()=>{
        usersRefetch()
    }, [userToShow])
    return(
        <main className="px-4 sm:px-6 lg:px-8">
            <section className="bg-white max-w-[1000px] rounded-2xl my-5 mx-auto border p-4 border-gray-200 ">
                <ProfilesList usersData={usersData} usersIsLoading={usersIsLoading} className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-5 gap-x-15 py-5 "/>
            </section>
        </main>
    )
}