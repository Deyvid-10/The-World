import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export async function fetchUsers(search){
  let parameter = '?search=' + search 

  if(search === "*****suggestions*****") {parameter = '?suggestion=true'} 

  let url = 'http://localhost:3000/users' + parameter;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    throw error;
  }

  const users = await response.json();  
  
  return users;
}

export async function fetchUserProfile(userProfileId){
  
  let url = 'http://localhost:3000/user/profile/' + userProfileId;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    throw error;
  }

  const userProfile = await response.json();  
  
  return userProfile;
}

export async function followUser(user) {  
   let url = 'http://localhost:3000/user/follow';
   
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({user}),
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

export async function unfollowUser(user) { 
     
   let url = 'http://localhost:3000/user/unfollow';
   
  const response = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify({user}),
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

export async function insertPost(formData){
  
  let url = "http://localhost:3000/upload"
  
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    throw error;
  }

  const res  = await response.json();
  
  return res;

}

export async function fetchPosts({}){
   let url = 'http://localhost:3000/posts';

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    throw error;
  }

  const posts = await response.json();  
  
  return posts;
}

export async function credentials({formData, type, method}) {  
   let url = 'http://localhost:3000/' + type;
   
  const response = await fetch(url, {
    method: method,
    body: formData,
    // headers: {
    //   'Content-Type': 'application/json',
      
    // },
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