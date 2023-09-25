// import { useState } from "react"
// import { Navigate } from 'react-router-dom';

export default function RegisterPage(){
  return (
    <div>Registering disabled</div>
  )
}

// export default function RegisterPage() {
//   const [username, setUserName] = useState('');
//   const [password, setPassword] = useState('');
//   const [redirect, setRedirect] = useState(false);

//  async function handleRegister(e) {
//     e.preventDefault();
//     const response = await  fetch('http://localhost:4000/register', {
   
//          method: 'POST',
//          body: JSON.stringify({username, password}),
//          headers: {'Content-Type': 'application/json'},
//        })
//        if (response.status === 200) {
//         alert('registration successful');
//         setRedirect(true)
//        } else {
//         alert("registration failed")
//        }    
//   }

//   if (redirect) {
//     return <Navigate to="/" />; // Redirect to home on successful registration
//   }
  

//   return (
//     <form className="register" onSubmit={handleRegister}>
//         <h1>Register</h1>
//         <input type="text" 
//               placeholder='username'
//               value={username}
//               onChange={e => setUserName(e.target.value)}
//               />
//         <input type="password" 
//               placeholder='password'
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               />
//         <button>Register</button>
//       </form>
    
//   )
// }
