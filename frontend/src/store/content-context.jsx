import React, { createContext } from "react";
import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchPosts, fetchUserProfile, fetchUsers, queryClient } from '../util/requests.js'
import { toast } from "react-toastify";

export const ContentContext = createContext({
    posts: {},
    users: ()=>{},
    userProfile: ()=>{}
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

    const ctxVlue = {
        posts: {postsData, postsIsLoading, postsIsError},
        users: getUsersData,
        userProfile: getUserProfile
    }

    return <ContentContext.Provider value={ctxVlue}>
        {children}
    </ContentContext.Provider>
}