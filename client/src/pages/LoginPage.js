import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function LoginPage() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext)
  
  async function handleLogin(event){
    event.preventDefault();
   const response = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    })
    if (response.ok) {
      response.json().then(userInfo =>{
          setUserInfo(userInfo)
          setRedirect(true);
      } )
     } else {
      alert("login failed")
     }
     console.log(response.headers.get('Set-Cookie'));   
  }
  if (redirect) {
    return <Navigate to={'/'}/>
    }
  return (    
     <form className="login" onSubmit={handleLogin}>
        <h1>Login</h1>
        <input type="text" 
              placeholder='username'
              value={username}
              onChange={event => setUserName(event.target.value)}
              />
        <input type="password" 
              placeholder='password'
              value={password}
              onChange={event => setPassword(event.target.value)}
              />
        <button className="custom-button" >Login</button>
        </form>
    
  )
}
