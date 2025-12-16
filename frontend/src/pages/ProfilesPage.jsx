import ProfilesList from "../components/ProfilesList"

export default function ProfilesPage(){
    return(
        <main className="px-4 sm:px-6 lg:px-8">
            <section className="bg-white max-w-[1000px] rounded-2xl my-5 mx-auto border p-4 border-gray-200 ">
                <ProfilesList className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-5 gap-x-15 py-5 "/>
            </section>
        </main>
    )
}