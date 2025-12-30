
import { useSearchParams } from "react-router-dom"
import ProfilesList from "../components/ProfilesList"
import { ContentContext } from "../store/content-context"
import { useContext } from "react"

export default function GeneralStructure({children}){

    const {users} = useContext(ContentContext)

    const {usersData, usersIsLoading, usersIsError, usersRefetch} = users("*****suggestions*****")

    return(
        <main className="flex justify-center mx-auto my-5 gap-3 px-4 sm:px-6 lg:px-8">
            {/* suggestions */}
            <section className="bg-white w-96 rounded-2xl h-[290px]  border p-4 border-gray-200">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <h2 className="text-gray-700 font-semibold text-xl">Suggestions</h2>
                    {/* <p className="text-gray-600 hover:text-gray-700 text-sm">View all</p> */}
                </div>
                <ProfilesList usersData={usersData} usersIsLoading={usersIsLoading} className="flex flex-col gap-5 py-5"/>
            </section>
            {children}
        </main>
    )
}