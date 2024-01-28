import React from 'react';
import avatar from '../assets/images/Cat_owl.webp'

function HomePage(props) {
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
        <a>Item1</a>
        <a>Item2</a>
        <a>Item3</a>
       
       
         
      </div>
      <div className='blog-container'>
       <h1>Blog</h1>
      </div>
      <div className='contact-container'>
        <h1>contact</h1>

      </div>
    </div>
  );
}

export default HomePage;