import React, { createContext } from "react";
import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchUser, queryClient } from '../util/requests.js'
import { toast } from "react-toastify";

export const SesionContext = createContext({
    user: {},
})


export default function SesionContextProvider({children}){

    const {data, isLoading, isError, isSuccess, error} = useQuery(
        {
            queryKey: ['user'],
            queryFn: fetchUser,
        }
    ) 

    const ctxVlue = {
        user: {data, isLoading, isError, isSuccess, error},
    }

    return <SesionContext.Provider value={ctxVlue}>
        {children}
    </SesionContext.Provider>
}