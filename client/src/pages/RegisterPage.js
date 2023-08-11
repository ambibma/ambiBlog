import { useState } from "react"


export default function RegisterPage() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

 async function handleRegister(e) {
    e.preventDefault();
    const response = await  fetch('http://localhost:4000/register', {
   
         method: 'POST',
         body: JSON.stringify({username, password}),
         headers: {'Content-Type': 'application/json'},
       })
       if (response.status === 200) {
        alert('registration successful');
       } else {
        alert("registration failed")
       }    
  }

  return (
    <form className="register" onSubmit={handleRegister}>
        <h1>Register</h1>
        <input type="text" 
              placeholder='username'
              value={username}
              onChange={e => setUserName(e.target.value)}
              />
        <input type="password" 
              placeholder='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              />
        <button>Register</button>
      </form>
    
  )
}
