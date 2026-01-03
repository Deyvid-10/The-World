import React, { createContext } from "react";
import { useMutation, useQuery } from '@tanstack/react-query';

import { addComment, fetchPosts, fetchUserProfile, fetchUsers, followUser, getComments, getMessages, getUsersWithMessages, insertPost, quantityChatNotSeen, queryClient, unfollowUser, viewMessages } from '../util/requests.js'
import { toast } from "react-toastify";

export const ContentContext = createContext({
    posts: {},
    users: ()=>{},
    userProfile: ()=>{},
    followUser: {},
    unfollowUser: {},
    insertPost: {},
    messages: ()=>{},
    usersMessages: ()=>{},
    viewMessages: {},
    getQuantityChatNotSeen: ()=>{},
    showComments: () =>{},
    postComment: {}
})


export default function ContentContextProvider({children}){

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


    function usersMessages(userId){
        
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

    const ctxVlue = {
        posts: {postsData, postsIsLoading, postsIsError},
        users: getUsersData,
        userProfile: getUserProfile,
        followUser: {mutateFollow, followIsLoading, followIsError},
        unfollowUser: {mutateUnfollow, unfollowIsLoading, unfollowIsError},
        insertPost: {mutatePost, postIsLoading, postIsError, postIsSuccess},
        messages,
        usersMessages,
        viewMessages: {mutateView, viewIsLoading, viewIsError},
        getQuantityChatNotSeen,
        showComments,
        postComment:  {mutateComment, commentIsLoading, commentIsError, commentAnswer}
    }

    return <ContentContext.Provider value={ctxVlue}>
        {children}
    </ContentContext.Provider>
}