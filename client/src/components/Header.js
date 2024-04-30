import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";




export default function Header() {
  const { setUserInfo, userInfo, userRole, setUserRole } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    if (!userInfo) {
      return;
    }
  
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to fetch user profile");
        }
      })
      .then((userInfo) => {
        setUserInfo(userInfo);
  
        if (userInfo.userRole === "admin") {
          setUserRole("admin");
        } else {
          setUserRole("user");
        }
  
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
  
        setLoading(false);
      });
  }, [userInfo]); 
  



  const username = userInfo?.username;

  return (
    <header>
    <Link to="/" className="neon-sign">
      Ambi
    </Link>

    <nav>  

      <div className="nav-items">
        <Link to='/blog'>Blog</Link>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            {username ? (
              <>               
                  
                  <Link to={`/profile/${userInfo.username}`}>Profile</Link>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>

    <div className='divider'></div>
  </header>
  );
}
