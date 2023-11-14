import React, { useEffect, useState } from 'react'
import { DotWave } from '@uiball/loaders'

import Post from '../components/Post'

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
            setLoading(false);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            setLoading(false);
        });
}, []);

  
  return (
    <>
    {loading ?  (
        <div class='loaderContainer'>

        <span> 
        <DotWave
          size={70}
          speed={1}
          color= "black"
          /> 
      </span>
        </div>
    ) : (
      <>
      {posts.length > 0 && posts.map(post => (
        <Post key={post.id} {...post}/>
      ))}
      </>
    
    )}
    
    </>
  )
}
