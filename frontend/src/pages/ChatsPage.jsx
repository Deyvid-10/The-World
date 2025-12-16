import Search from "../components/Search"
import { PhotoIcon, VideoCameraIcon, PaperAirplaneIcon, EyeIcon} from "@heroicons/react/24/outline"

export default function ChatsPage(){
    return(
        <section className="flex gap-3 h-[82vh] md:h-[89vh] md:max-w-[1500px] mx-auto my-5 px-4 sm:px-6 lg:px-8">
            <section className="hidden md:flex flex-col bg-white rounded-2xl border p-4 w-full md:w-xl border-gray-200">
                <h2 className="font-semibold text-2xl mb-4">Chats</h2>
                <Search className="relative items-center w-full my-5 block"/>
                <div className="overflow-y-auto h-[85%] pr-1">
                    <ul className="h-full">
                        <li className="flex mb-2 gap-2 border-b p-2 border-gray-200">
                            <span className="rounded-full bg-amber-400 size-10"></span>
                            <div className="w-full">
                                <div className="flex justify-between gap-1 w-full">
                                    <p className="text-gray-700 font-semibold">Deyvid Marmolejo</p>
                                    <p className="text-gray-600 text-sm">8:30 pm</p>
                                </div>
                                <div className="rounded-full w-10 ml-auto bg-emerald-500 flex justify-center items-center">
                                    <p className="text-sm font-semibold text-white text-end">2</p>
                                </div>
                            </div>
                        </li>
                     </ul>
                </div>
            </section>

            

            <section className="flex flex-col justify-between w-full bg-white rounded-2xl border p-4 border-gray-200">
                <div className="flex items-center border-b border-gray-200 gap-2 px-2 pb-3">
                    <div className="rounded-full bg-amber-400 size-10"></div>
                    <p className="text-gray-700 text-md font-semibold">Deyvid Marmolejo</p>
                </div>
                <div className=" h-full p-3 flex flex-col overflow-auto">
                    <div className="mt-auto flex flex-col gap-2">
                        <div className="bg-gray-100 w-fit max-w-md py-1 px-2 rounded-t-xl rounded-br-xl">
                            <p className="">I want more detailed information.</p>
                            <p className="text-xs text-end text-gray-600">10:10pm</p>
                        </div>
                        <div className="text-white bg-emerald-600 w-fit max-w-md ml-auto py-1 px-2 rounded-t-xl rounded-bl-xl">
                            <p>They got there early, and got really good seats.</p>
                            <div className="flex justify-end items-center gap-1">
                                <EyeIcon className="size-4"></EyeIcon>
                                <p className="text-xs text-end  text-gray-200">10:10pm</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="flex items-center border-t border-gray-200 pt-2">
                       <input
                    id="seacrhItem"
                    name="seacrhItem"
                    type="text"
                    className="block rounded-lg mr-2 w-full text-gray-600 h-9 px-3 py-0.5 text-base  placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6"
                    placeholder='Write a message...'
                />
                    <div className="flex gap-2 text-gray-500">
                        <PhotoIcon className="size-7"/>
                        <VideoCameraIcon className="size-7"/>
                        <PaperAirplaneIcon className="text-white size-7 p-1 font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400"/>
                    </div>
                </div>

            </section>
        </section>
    )
}