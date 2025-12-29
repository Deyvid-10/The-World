import React, { createContext } from "react";
import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchPosts, fetchUsers, queryClient } from '../util/requests.js'
import { toast } from "react-toastify";

export const ContentContext = createContext({
    posts: {},
    users: ()=>{}
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

    const ctxVlue = {
        posts: {postsData, postsIsLoading, postsIsError},
        users: getUsersData,
    }

    return <ContentContext.Provider value={ctxVlue}>
        {children}
    </ContentContext.Provider>
}