import React from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Search({...props}){
    return  <div {...props}>
                <input
                    id="seacrhItem"
                    name="seacrhItem"
                    type="text"
                    className="block rounded-lg w-full text-gray-600 bg-gray-100 h-9 px-3 py-0.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6"
                    placeholder='Search...'
                />
            
                <a href="#" className="p-2 absolute -top-0.5 right-0 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                </a>
            </div>
}