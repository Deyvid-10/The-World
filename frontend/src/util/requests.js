import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export async function credentials({formData, type, method}) {  
   let url = 'http://localhost:3000/' + type;
   
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
      
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    throw error;
  }

  const res  = await response.json();
  
  return res;
}
  
export async function fetchLogout() {
  let url = 'http://localhost:3000/logout';

  const response = await fetch(url, {
      method: 'POST',
      credentials: "include",
    }
  )

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    throw error;
  }

  const message = await response.json();  
  
  return message;
}

export async function fetchUser() {
  let url = 'http://localhost:3000/user';

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    throw error;
  }

  const user = await response.json();  
  
  return user;
}

export async function addComment({comment}) {  
   let url = 'http://localhost:3000/comment/insert';
   
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(comment),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    throw error;
  }

  const res  = await response.json();
  
  return res;
}