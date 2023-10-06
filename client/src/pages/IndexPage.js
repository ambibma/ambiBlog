import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/post')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
           
            setPosts(posts);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}, []);

  return (
    <>
    {posts.length > 0 && posts.map(post => (
      <Post key={post.id} {...post}/>
    ))}
    </>
  )
}
