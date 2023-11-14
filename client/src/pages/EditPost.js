import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";

export default function EditPost(){
  const {id} = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const navigate = useNavigate();
  
  const [redirect, setRedirect] = useState(false)


  useEffect(()=> {
    fetch('http://localhost:4000/post/'+id , {
    })
    .then(response => {
      response.json().then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
    });
  }, []);
  

  async function updatePost(e){
    const data = new FormData();
    data.set('title', title);
    data.set( 'summary' , summary);
    data.set ('content' , content);
    data.set ('id' , id);
    e.preventDefault();

    if(files?.[0]) {
      data.set('files', files?.[0])
    }
    const response = await fetch('http://localhost:4000/api/post', {
      method: 'PUT',
      credentials: 'include',
      body: data,
    });
    if (response.ok) {
      
      setRedirect(true);
    }
  }

    if (redirect) {
     return <Navigate to={'/post/'+id} />
    }

    async function deletePost() {
      const response = await fetch(`http://localhost:4000/post/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        navigate('/')
      }
     
    }
  



  return (
    <div className="quill-container">
    <form onSubmit={updatePost}>  
      <input 
      type="text" 
      placeholder={'Title'} 
      value={title}
      onChange={e => setTitle(e.target.value)} />
      <input 
      type="summary" 
      value={summary}
      placeholder={'Summary'}
      onChange={e => setSummary(e.target.value)} 
      />
      <input 
      type="file"  
      name='file'
      onChange={e => setFiles(e.target.files)}
      />
      <Editor value={content}  onChange={setContent}/>
      <button style={{marginTop: '5px'}}>Update Post </button>
    </form>
    <button  onClick={deletePost} style={{marginTop: '5px'}}>Delete Post </button>
      </div>
    


   
  );
  
}