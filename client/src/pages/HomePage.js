import {useState, useEffect} from 'react';
import avatar from '../assets/images/Cat_owl.webp'
import { ProjectData } from '../Data/ProjectData';
import Title from '../components/Title';
import { Link, Navigate } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';

function HomePage() {
  //State for projects
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  //State for Blog posts

  function getProjects(){
    const fetchedProjects = ProjectData;
    setProjects(fetchedProjects);
    console.log(fetchedProjects)
    return fetchedProjects;
  }

  useEffect(() => {
    getProjects();
  }, []);

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
            console.log(posts);
           
        })
        .catch(error => {
            console.error('Fetch error:', error);
            
        });
}, []);


  return (
    <div className='home-container'>
      <div className='profile-container'>
       
       <h1 className='profile-header'>Profile</h1>
       <div className='avatar-container'>
        <img className='avatar'src={avatar} alt='avatar'/>
       </div>
     
       <p className='profile-text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
     
       
      </div>
      <div className='project-container'>
        <h1>Project</h1>
        {projects.map(project => (
          <Title key={project.id} {...project}/>
        ))}
       
       
         
      </div>
      <div className='blog-container'>
       <h1>Blog</h1>
        {posts.map(post=> (
          <Title 
          key={post.id} 
          title={post.title}  
          link ={`http://localhost:3000/post/${post._id}`}
          description={post.summary}
          date={post.createdAt}

             

          />
        ))}
      </div>
      <div className='contact-container'>
        <h1>contact</h1>
        <ContactForm/>

      </div>
    </div>
  );
}

export default HomePage;