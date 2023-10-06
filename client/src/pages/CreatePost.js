import { useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Editor from '../components/Editor';
import { Navigate } from 'react-router-dom';



function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(e) { 
    const data = new FormData();
    data.set('title', title)
    data.set( 'summary' , summary )
    data.set ('content' , content)
    data.set('files', files[0] )
    e.preventDefault();
    
  
    
    const response  = await  fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
      credentials: 'include'
      

    });

    if (response.ok) {
        setRedirect(true);
    }
  }
    if (redirect) {
     return <Navigate to={'/'} />
    }


  return (
    
    <form onSubmit={createNewPost}>  
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
      <button style={{marginTop: '5px'}}>Create Post </button>
    </form>
   
  );
}

export default CreatePost;