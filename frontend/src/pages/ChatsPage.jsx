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

const url = import.meta.env.VITE_API_URL

// const socket = io(url, { 
//     withCredentials: true
// })

export default function ChatsPage(){
    const {userId} = useParams()
    

    const [userMessage, setUserMessage] = useState({});
    const [userListMessage, setUserListMessage] = useState([]);
    const [search, setSearch] = useState("")
    

    const {messages, usersMessages, viewMessages, getQuantityChatNotSeen, handleCreateChat, isConnectedToSocket, handleChatSocket, chatState, handleSendChat, socket} = useContext(ContentContext)
    const {userMessageData, userMessageIsLoading, userMessageIsError, userMessageRefetch} = usersMessages(userId)
    const {messageData, messageIsLoading, messageIsError} = messages(userId)
    const {mutateView, viewIsLoading, viewIsError} = viewMessages

    const {notSeenQuantityRefetch} = getQuantityChatNotSeen()
    const [chat, setChat] = chatState

    useEffect(() => {
       
        if(messageData){
            setChat(messageData)  
        }
    }, [messageData, userId]);

    
    
  useEffect(()=>{

    handleCreateChat(userId)
    handleChatSocket(userId, userMessageRefetch)
   
    return ()=>{
    //   socket.off("createChat")
      socket.current.off("chatMessage")
    //   socket.off("chatCreated")
    }
  }, [userId, isConnectedToSocket])  
  
  function sendMessage (e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const message = fd.get("message")

    if(message.trim()){
        
      handleCreateChat(userId)
      if(isConnectedToSocket){
        handleSendChat(userId, message)
      }
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
        <section className="flex flex-col md:flex-row gap-3 md:max-w-[1500px] mx-auto my-5 px-4 sm:px-6 lg:px-8">
            <section className="flex flex-col bg-white rounded-2xl border p-4 w-full md:w-xl border-gray-200">
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

            <section className="flex flex-col h-[87vh] justify-between w-full bg-white rounded-2xl border p-4 border-gray-200">
           
                    {userMessage && Object.values(userMessage).length !== 0 &&
                    <div className="flex items-center border-b border-gray-200 gap-2 px-2 pb-3">
                        <div className="rounded-full bg-amber-400 size-10">
                            <img className="size-full rounded-full object-cover" src={url + userMessage.users_img} alt={"profile photo for " + userMessage.users_name + " " + userMessage.users_last_name} />
                        </div>
                        <Link to={"/profile/" + userMessage.users_id + "/posts"} className="text-gray-700 text-md font-semibold">{userMessage.users_name + " " + userMessage.users_last_name}</Link>
                    </div>}
                    
                    
                    {chat.length !== 0 ?
                        <div ref={scrollRef} className=" h-full p-3 flex flex-col overflow-y-auto">
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