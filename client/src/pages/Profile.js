import { UserContext } from '../context/UserContext';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useState, useContext } from 'react';

function Profile() {
  const {userInfo, setUserInfo} = useContext(UserContext);  
  const [redirect, setRedirect] = useState(false);

  function handleLogout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          setUserInfo(null);
          setRedirect(true);
          
        } else {
          throw new Error("Logout failed");
        }
      })
      
      .catch((error) => {
        console.error("Logout error:", error);
        
      });
      
    }
    if (redirect) {
      return <Navigate to={'/'} />
   
  }


  return (
    <div className='profile-container-2'>
       
       <h1 className='profile-header-2'> Profile Details</h1>
      <h1>
     
      </h1>
     <h3>Username:</h3>{userInfo && <h3>{userInfo.username}</h3>}
      <button className='custom-button' onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;