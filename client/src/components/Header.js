import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Header() {
  const [username, setUsername] = useState(null)
  useEffect(()=> {
    fetch('http://localhost:4000/profile', {
      credentials: 'include'
    }).then(response => {
      response.json().then(userInfo => {
        setUsername(userInfo.username);
      })
    })

  }, [])
  function handleLogout () {
      fetch('http://localhost:4000/logout', {
        credentials: 'include',
        method: 'POST',
      })
  }

  return (
    <header >
        <Link to= "/" className = "logo"> My Blog</Link>
        <nav>
          {username && (
            <>
            <Link to="/create">create New Post</Link>
            <a onClick={handleLogout}>Logout</a>
            </>
          )}
            {!username &&(
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
        
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>        
        </nav>
      </header>
  )
}
