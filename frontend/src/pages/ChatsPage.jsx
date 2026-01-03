import Search from "../components/Search"
import { PhotoIcon, VideoCameraIcon, PaperAirplaneIcon, EyeIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline"
import { useContext } from "react"
import { useState, useEffect } from "react"
import {io} from "socket.io-client"
import { ContentContext } from "../store/content-context"
import { data, useParams, Link } from "react-router-dom"
import { useRef } from "react"
import { useLayoutEffect } from "react"
import { queryClient } from "../util/requests"
import { toast } from "react-toastify"

const url = "http://localhost:3000/"

const socket = io(url, { 
    withCredentials: true
})

export default function ChatsPage(){
    const {userId} = useParams()
    

    const [userMessage, setUserMessage] = useState({});
    const [userListMessage, setUserListMessage] = useState([]);
    const [search, setSearch] = useState("")
    const [chat, setChat] = useState([]);

    const {messages, usersMessages, viewMessages, getQuantityChatNotSeen} = useContext(ContentContext)
    const {userMessageData, userMessageIsLoading, userMessageIsError, userMessageRefetch} = usersMessages(userId)
    const {messageData, messageIsLoading, messageIsError} = messages(userId)
    const {mutateView, viewIsLoading, viewIsError} = viewMessages

    const {notSeenQuantityRefetch} = getQuantityChatNotSeen()

    useEffect(() => {
       
        if(messageData){
            setChat(messageData)
            
        }
    }, [messageData, userId]);
    
  useEffect(()=>{
    
    socket.emit("joinChat", { userReceiver: userId});
    socket.on("chatMessage", (msg)=>{
        
//         toast.success( <div>
//                     <h4 style={{ margin: 0 }}>¡Bienvenido!</h4>
//                     <p>{msg.message}</p>
//                 </div>
// , {
//             position: "bottom-left",
//             autoClose: 3000, 
//             pauseOnHover: true,
//             icon: <img src="data:image/png;base64,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" alt="" />
//         })
        
        if(msg.userReceiver !== userId){
            msg.type = "receiver"
        }
        else{
            msg.type = "transmitter"
        }

        msg.messages_date = new Date()
        setChat((prev)=>[...prev, msg])
    })

    return ()=>{
      socket.off("chatMessage")
    }
  }, [userId, userMessageData])  
  
  function sendMessage (e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const message = fd.get("message")
    
    if(message.trim()){
      socket.emit("chatMessage", { userReceiver: userId, message})    
      e.target.reset()
    }
  }

    function formatDate(date)
    {
        const newDate = new Date(date);
        const formatedDate = newDate.toLocaleString("es-DO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
        
        return formatedDate
    }

    useEffect(()=>{
        if(userMessageData){                        
            setUserMessage(userMessageData.find((data)=>data.users_id === Number(userId)))
            setUserListMessage(userMessageData)
            setSearch("")
        }
    }, [userMessageData, userId])

    function handleSearchUser(e){
        let user = e.target.value
        setSearch(user)
        if(userMessageData){
            setUserListMessage(userMessageData.filter((data)=>(data.users_name + " " + data.users_last_name).includes(user.trim())));
        }
        
        userMessageRefetch()
        
    }
    const scrollRef = useRef();

    useLayoutEffect(() => {
    const scrollChat = scrollRef.current;
    if (scrollChat) {
      scrollChat.scrollTop = scrollChat.scrollHeight; 
    }
  }, [chat]);

    function handleViewMessages(){
        
        mutateView(userId)
        userMessageRefetch()
        notSeenQuantityRefetch()
    }

    


    return(
        <section className="flex gap-3 h-[82vh] md:h-[89vh] md:max-w-[1500px] mx-auto my-5 px-4 sm:px-6 lg:px-8">
            <section className="hidden md:flex flex-col bg-white rounded-2xl border p-4 w-full md:w-xl border-gray-200">
                <h2 className="font-semibold text-2xl mb-4">Chats</h2>
                <form className="relative items-center w-full my-5 block">
                    <input
                        onChange={handleSearchUser}
                        value={search}
                        id="searchMessageUser"
                        name="searchMessageUser"
                        type="text"
                        className="block rounded-lg w-full text-gray-600 bg-gray-100 h-9 px-3 py-0.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6"
                        placeholder='Search...'
                    />
                
                    <div className="p-2 absolute -top-0.5 right-0 text-gray-400 hover:text-gray-500">
                        <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                    </div>
                </form>
                <div  className="overflow-y-auto pr-1">
                        <ul className="h-full">
                            {userListMessage.length !== 0 && userListMessage.map((user)=>(
                                <li key={user.users_id} >
                                    <Link to={"/chats/" + user.users_id} className="flex w-full mb-2 gap-2 border-b p-2 border-gray-200">
                                        <figure className="rounded-full bg-amber-400 size-10">
                                            <img className="rounded-full size-full object-cover" src={url + user.users_img} alt={"profile photo for " + user.users_name} />
                                        </figure>
                                        <div className="w-[85%] my-auto">
                                            <div className="flex justify-between">
                                                <p className="text-gray-700 font-semibold">{user.users_name + " " + user.users_last_name}</p>
                                                {/* <p className="text-gray-600 text-sm">8:30 pm</p> */}
                                                {(user.messagesNotViewed && user.messagesNotViewed != 0) && <div className="rounded-full w-10 bg-emerald-500 flex justify-center items-center">
                                                    <p className="text-sm font-semibold text-white ">{user.messagesNotViewed}</p>
                                                </div>}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            )) }
                         </ul>
                </div>
            </section>

            

            <section className="flex flex-col justify-between w-full bg-white rounded-2xl border p-4 border-gray-200">
           
                    {userMessage && Object.values(userMessage).length !== 0 &&
                    <div className="flex items-center border-b border-gray-200 gap-2 px-2 pb-3">
                        <div className="rounded-full bg-amber-400 size-10">
                            <img className="size-full rounded-full object-cover" src={url + userMessage.users_img} alt={"profile photo for " + userMessage.users_name + " " + userMessage.users_last_name} />
                        </div>
                        <Link to={"/profile/" + userMessage.users_id + "/posts"} className="text-gray-700 text-md font-semibold">{userMessage.users_name + " " + userMessage.users_last_name}</Link>
                    </div>}
                    
                    
                    {chat.length !== 0 ?
                        <div ref={scrollRef} className=" h-full p-3 flex flex-col overflow-auto">
                            <div className="mt-auto flex flex-col gap-2">
                            {chat.map((msg, index)=>
                                    (
                                        <div key={index}>
                                            {msg.type === "receiver" && <div className="bg-gray-100 text-end w-fit max-w-md py-1 px-2 rounded-t-xl rounded-br-xl">
                                                <p className="">{msg.message}</p>
                                                <p className="text-xs text-end text-gray-600">{formatDate(msg.messages_date)}</p>
                                            </div>}
                                            {msg.type === "transmitter" &&  <div className="text-white text-end bg-emerald-600 w-fit max-w-md ml-auto py-1 px-2 rounded-t-xl rounded-bl-xl">
                                                <p>{msg.message}</p>
                                                <div className="flex justify-end items-center gap-1">
                                                    <p className="text-xs text-end  text-gray-200">{formatDate(msg.messages_date)}</p>
                                                    
                                                </div>
                                            </div>}
                                        </div>
                                    )
                            ) }
                            
                            </div>
                        </div>
                    :
                    <section className="flex flex-col justify-between w-full">
                        <p className="m-auto">This does not start</p>
                    </section>
                    }
                    
              
                 
                <form onSubmit={sendMessage} className="flex items-center border-t border-gray-200 pt-2">
                       <input
                            onFocus={handleViewMessages}
                            onChange={handleViewMessages}
                            disabled={userId == 0}
                            id="message"
                            name="message"
                            type="text"
                            className="block rounded-lg mr-2 w-full text-gray-600 h-9 px-3 py-0.5 text-base  placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6"
                            placeholder='Write a message...'
                        />
                    <div className="flex gap-2 text-gray-500">
                        {/* <PhotoIcon className="size-7"/> */}
                        {/* <VideoCameraIcon className="size-7"/> */}
                        <button  disabled={userId == 0}>
                            <PaperAirplaneIcon className="text-white size-7 p-1 font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400"/>
                        </button>
                    </div>
                </form>

            </section>
           
        
        </section>
    )
}