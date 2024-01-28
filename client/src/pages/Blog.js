import { DotWave } from '@uiball/loaders'
import {useState, useEffect, useContext} from 'react';
import Post from '../components/Post';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';

function Blog() {
  const { setUserInfo, userInfo, userRole, setUserRole } = useContext(UserContext);
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
    {userRole === "admin" && (
        <div className="create-link-container">
          <Link id="create-link" to="/create">Create New Post   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            </Link>
        </div>
      )}

    {loading ?  (
        <div class='loaderContainer'>

        <span> 
        <DotWave
          size={70}
          speed={1}
          color= "white"
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