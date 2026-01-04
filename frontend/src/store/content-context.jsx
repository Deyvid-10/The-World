import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from '@tanstack/react-query';

import { addComment, disLike, fetchPosts, fetchUserProfile, fetchUsers, followUser, getComments, getMessages, getUsersWithMessages, insertPost, like, quantityChatNotSeen, queryClient, unfollowUser, viewMessages } from '../util/requests.js'
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { SesionContext } from "./sesion-context.jsx";


export const ContentContext = createContext({
    posts: {},
    users: ()=>{},
    userProfile: ()=>{},
    followUser: {},
    unfollowUser: {},
    // likesQuantityState:[],
    // likeState: [],
    like: {},
    disLike: {},
    insertPost: {},
    messages: ()=>{},
    usersMessages: ()=>{},
    viewMessages: {},
    getQuantityChatNotSeen: ()=>{},
    showComments: () =>{},
    postComment: {},
    isConnectedToSocket: false,
    handleCreateChat: () => {},
    handleChatCreated: ()=>{},
    handleChatSocket: ()=>{},
    chatState: [],
    handleSendChat: ()=>{},
    socket: null
})

const url = "http://localhost:3000/"


export default function ContentContextProvider({children}){

    const { user } = useContext(SesionContext)

    const { data, isLoading, isSuccess } = user
    // console.log(data);
    
    const {data: postsData, isLoading: postsIsLoading, isError: postsIsError} = useQuery(
        {
            queryKey: ['posts'],
            queryFn: fetchPosts,
        }
    ) 
    
    function getUsersData(searchUser){
        
        const {data: usersData, isLoading: usersIsLoading, isError: usersIsError, refetch: usersRefetch} = useQuery(
        {
            queryKey: ['users'],
            queryFn: ()=>fetchUsers(searchUser),
        }
    ) 
        return {usersData, usersIsLoading, usersIsError, usersRefetch}
    }

    function getUserProfile(userProfileId){
        
        const {data: userProfileData, isLoading: userProfileIsLoading, isError: userProfileIsError, refetch: userProfileRefetch} = useQuery(
        {
            queryKey: ['userProfile'],
            queryFn: ()=>fetchUserProfile(userProfileId),
        }
    ) 
        return {userProfileData, userProfileIsLoading, userProfileIsError, userProfileRefetch}
    }

    const {mutate: mutateFollow, isPending: followIsLoading, isError: followIsError} = useMutation({
        mutationFn: followUser,
        onSuccess: ()=>{
            queryClient.invalidateQueries({ queryKey: ['userProfile']})
            queryClient.invalidateQueries({ queryKey: ['users']})
        } 
    })

    const {mutate: mutateUnfollow, isPending: unfollowIsLoading, isError: unfollowIsError} = useMutation({
        mutationFn: unfollowUser,
        onSuccess: ()=>{
            queryClient.invalidateQueries({ queryKey: ['userProfile']})
            queryClient.invalidateQueries({ queryKey: ['users']})
        } 
    })

    // const [isLike, setIsLike] = useState(0)
    // const [thisLikesQuantity, setThisLikesQuantity] = useState(0)

    const {mutate: mutateLike, isPending: liekIsLoading, isError: likeIsError} = useMutation({
        mutationFn: like,
        // onSuccess: ()=>{
        //     setIsLike(1)
        // } 
    })

    

    const {mutate: mutateDisLike, isPending: disLikeIsLoading, isError: disLikeIsError} = useMutation({
        mutationFn: disLike,
        // onSuccess: ()=>{
        //     setIsLike(0)
        // } 
    })

    const {mutate: mutatePost, isPending: postIsLoading, isError: postIsError, isSuccess: postIsSuccess} = useMutation({
        mutationFn: insertPost,
        onSuccess: ()=>{
            queryClient.invalidateQueries({ queryKey: ['userProfile']})
        } 
    })

    function messages(receiverId){
        const {data: messageData, isLoading: messageIsLoading, isError: messageIsError} = useQuery(
            {
                queryKey: ['messages', {user: receiverId}],
                queryFn: ()=>getMessages(receiverId),
            }
        ) 
        return {messageData, messageIsLoading, messageIsError} 
    }


    function usersMessages2(userId){
        
        const {data: userMessageData, isLoading: userMessageIsLoading, isError: userMessageIsError, refetch: userMessageRefetch} = useQuery(
        {
            queryKey: ['userMessages'],
            queryFn: () => getUsersWithMessages(userId),
        }
    ) 

    return {userMessageData, userMessageIsLoading, userMessageIsError, userMessageRefetch}
    }

    const {mutate: mutateView, isPending: viewIsLoading, isError: viewIsError} = useMutation({
        mutationFn: viewMessages,
        // onSuccess: ()=>{
        //     queryClient.invalidateQueries({ queryKey: ['userProfile']})
        // } 
    })
    function getQuantityChatNotSeen(){
        const {data: notSeenQuantityData, isLoading: notSeenQuantityIsLoading, isError: notSeenQuantityIsError, refetch: notSeenQuantityRefetch} = useQuery(
            {
                queryKey: ['messages', 'chatNotSeen'],
                queryFn: quantityChatNotSeen,
            }
        ) 
        return { notSeenQuantityData,  notSeenQuantityIsLoading,  notSeenQuantityIsError, notSeenQuantityRefetch}
    }

    function showComments(postId){
                
        const {data: commentsData, isLoading: commentsIsLoading, isError: commentsIsError, refetch: commentsRefetch} = useQuery(
        {
            queryKey: ['showComments'],
            queryFn: () => getComments(postId),
        }
        )
        return  {commentsData, commentsIsLoading, commentsIsError, commentsRefetch}
    }

    const {mutate: mutateComment, data: commentAnswer, isPending: commentIsLoading, isError: commentIsError} = useMutation({
        mutationFn: addComment,
        onSuccess: ()=>{
            queryClient.invalidateQueries({ queryKey: ['showComments']})
            
        } 
    })

    let urlBackend = 'http://localhost:3000'

    const socket = useRef(null)
    const [isConnected, setIsConnected] = useState(false);

    useEffect(()=>{
        socket.current = io(urlBackend, { 
            withCredentials: true
        })

        socket.current.on("connect", () => {
            setIsConnected(true);
        });


        return ()=>{
            socket.current.disconnect()
        }
    }, [])

     function handleCreateChat(userId){
        
        if (isConnected) console.log("Conected1");
        
        if (!socket.current) return
        socket.current.emit("createChat", { userReceiver: userId})
    }
    function handleChatCreated(){
        if (isConnected) console.log("Conected2");
        
        if (!socket.current) return
        // socket.current.emit("createChat", { userReceiver: userId})
        socket.current.on("chatCreated", ({roomId}) => {
            console.log(roomId);
                
            socket.current.emit("joinChat", { roomId});
        });
        }

        const [chat, setChat] = useState([]);

    function handleChatSocket(userId, refetch, notice, play, userLogged){
        // console.log(usersMessages2(42));
        console.log("PRB");
        
        if (!socket.current) return

        socket.current.on("chatMessage", (msg)=>{

            if(notice && msg.userTransmitter != userLogged){
                play()
                console.log("/chats/" + msg.userTransmitter);
                
                toast.success(<div>
                                <a href={"/chats/" + msg.userTransmitter}>
                                    <p className="font-bold text-black truncate w-70">{msg.userName}</p>
                                    <p className="truncate w-70">{msg.message}</p>
                                </a>
                            </div>, {position: "bottom-left",
                            icon: false
                })
            }
            const chatId = msg.roomId.split("*")
            console.log(msg);
            refetch()
            // userMessageRefetch()
            // notSeenQuantityRefetch()
            if(chatId.includes(userId)){
                console.log(userId);
                console.log("Sending");
                if(msg.userTransmitter == userId){
                    msg.type = "receiver" 
                }
                else{
                    msg.type = "transmitter"
                }
                msg.messages_date = new Date()
            
                setChat((prev)=>[...prev, msg])
            }
            else{                
                setChat((prev)=>[...prev])
            }
        })
    }

    function handleSendChat(userId, message){
        if (!socket.current) return
        if(data){
            socket.current.emit("chatMessage", { userReceiver: userId, message, userName: `${data[0].users_name} ${data[0].users_last_name}`, userProfilePhoto: data[0].users_img})  
        }
        
    }

    const ctxVlue = {
        posts: {postsData, postsIsLoading, postsIsError},
        users: getUsersData,
        userProfile: getUserProfile,
        followUser: {mutateFollow, followIsLoading, followIsError},
        unfollowUser: {mutateUnfollow, unfollowIsLoading, unfollowIsError},
        insertPost: {mutatePost, postIsLoading, postIsError, postIsSuccess},
        // likesQuantityState:  [thisLikesQuantity, setThisLikesQuantity],
        // likeState: [isLike, setIsLike],
        like: {mutateLike, liekIsLoading, likeIsError},
        disLike: {mutateDisLike, disLikeIsLoading, disLikeIsError},
        messages,
        usersMessages: usersMessages2,
        viewMessages: {mutateView, viewIsLoading, viewIsError},
        getQuantityChatNotSeen,
        showComments,
        postComment:  {mutateComment, commentIsLoading, commentIsError, commentAnswer},
        isConnectedToSocket: isConnected,
        handleCreateChat,
        handleChatCreated,
        handleChatSocket,
        chatState: [chat, setChat],
        handleSendChat, 
        socket
    }

    return <ContentContext.Provider value={ctxVlue}>
        {children}
    </ContentContext.Provider>
}