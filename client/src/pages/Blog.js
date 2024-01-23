import { DotWave } from '@uiball/loaders'
import {useState, useEffect} from 'react';
import Post from '../components/Post';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://ambi-blog-api.onrender.com/post')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
           
            setPosts(posts);
            console.log(posts); 
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
  );
}

export default Blog;