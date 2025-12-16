import PostItem from "../components/PostItem"

import GeneralStructure from "../components/GeneralStructure"

export default function Profile(){
    return(
        <GeneralStructure>
            <section className="max-w-[1000px] flex flex-col gap-4 bg-white rounded-2xl border py-4 border-gray-200">
                <div className="flex gap-5 items-center mx-auto">
                    <figure className="overflow-hidden rounded-full size-40 bg-emerald-600">
                        {/* <img 
                            src=""  
                            alt="" 
                            className="object-cover"/> */}
                    </figure>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between gap-10">
                            <h2 className="font-semibold text-lg">Deyvid Marmolejo</h2>
                            <button className="rounded-full text-sm bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Edit profile</button>
                        </div>
                        <div className="flex gap-5">
                            <p>0 Posts</p>
                            <p>0 Followers</p>
                            <p>0 Followed</p>
                        </div>
                        <p className="text-gray-600">I'm the world</p>
                    </div>
                </div>

                <section className="w-full flex flex-col gap-4">
                    <PostItem/>
                    <PostItem/>
                </section>
            </section>
        </GeneralStructure>
    )
}