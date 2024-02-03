import { formatISO9075 } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { DotWave } from '@uiball/loaders'
import {Link} from 'react-router-dom';

function PostDetails() {
  const {id }= useParams();
  const {userInfo} = useContext(UserContext);
  const [postInfo, setPostInfo] = useState(null)
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => {
        if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Invalid response format");
        }
        return response.json();
      })
      .then((postInfo) => {
        setPostInfo(postInfo);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if(!postInfo) return '';

  return (
    <>
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
      <div className='post-page'>
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className='author'>by {postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className='edit-row'>
        <Link className='edit-btn' to={`/edit/${postInfo._id}`}> Edit This Post
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        </Link>
        
        
        </div>)}
        <div className='image'>
        
        <img src={postInfo.coverURL}/>
        </div>
        <div className='content'dangerouslySetInnerHTML={{__html:postInfo.content}}/>
        
        </div>
        </>
        )} 

  </>
  
);
}

export default PostDetails;