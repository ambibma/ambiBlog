import React, { useEffect, useState } from 'react'
import { DotWave } from '@uiball/loaders'

import Post from '../components/Post'

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitorCounter, setVisitorCounter] = useState([]);

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

  useEffect(() => {
    fetch ('http://localhost:4000/')
      .then(response => {
        if (!response.ok) {
          throw new Error (`HTTP error!, Status: ${response.status}`);
          }
          return response.json();
        })
        .then(visitorCounter => {
          setVisitorCounter(visitorCounter)

        })
    
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
    <div className="visitorCounter">
     <h2>Visitors: {visitorCounter.visitors}</h2> 

    </div>
    </>
  )
}
