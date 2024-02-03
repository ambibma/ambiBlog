import {useState, useEffect} from 'react';
import avatar from '../assets/images/Cat_owl.webp'
import { ProjectData } from '../Data/ProjectData';
import Title from '../components/Title';
import { Link, Navigate } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';

function Index() {
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
           
        })
        .catch(error => {
            console.error('Fetch error:', error);
            
        });
}, []);


  return (
    <div className='home-container'>
      <div className='profile-container'>
       
       <h1 className='profile-header'>Welcome to Ambi's blog!</h1>
       <div className='avatar-container'>
        <img className='avatar'src={avatar} alt='avatar'/>
       </div>
     
       <p className='profile-text'> I am a full stack developer who likes building, optimizing and learning. I specialize in React.JS, Node.js, Express and C# .NET. I enjoy the development process of writing code and straining my eyes at the screen locating bugs. I created this website from the ground up to document about my experiences, learnings and findings in my developer journey. While I am always practicing to hone my skills in web dev, I also have interests in indie game development with C++ and tinkering with RaspberryPi. Other hobbies of mine include playing video games and painting.      </p>
     
       
      </div>
      <div className='project-container'>
      <h1 className='profile-header'>Projects</h1>
        {projects.map(project => (
          <Title key={project.id} {...project}/>
        ))}
       
       
         
      </div>
      <div className='blog-container'>
      <h1 className='profile-header'>Blog</h1>
        {posts.map(post=> (
          <Title 
          key={post.id} 
          title={post.title}  
          link ={`https://ambi-blog.onrender.com/post/${post._id}`}
          description={post.summary}
          date={post.createdAt}

             

          />
        ))}
      </div>
      <div className='contact-container'>
      <h1 className='contact-header'>Contact</h1>
        <ContactForm/>

      </div>
    </div>
  );
}

export default Index;