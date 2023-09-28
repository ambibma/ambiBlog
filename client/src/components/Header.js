import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Header() {
  const { setUserInfo, userInfo, userRole, setUserRole } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ambi-blog.onrender.com/profile", {
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

        // Check if the user has 'admin' role
        if (userInfo.userRole === "admin") {
          setUserRole("admin");
        } else {
          setUserRole("user"); // Set userRole to "user" by default
        }

        setLoading(false); // Set loading to false after user info is fetched
      })
      .catch((error) => {
        console.error(error);
        // Handle any errors here, e.g., redirect to the login page
        setLoading(false); // Set loading to false on error
      });
  }, []);

  function handleLogout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          setUserInfo(null);
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
        // Handle logout error here
      });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        My Blog
      </Link>
      <nav>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            {username ? (
              <>
                <span>Hello, {username}</span>
                {userRole === "admin" && (
                  <>
                    <Link to="/create">Create New Post</Link>
                    <a onClick={handleLogout}>Logout</a>
                  </>
                )}
                {userRole === "user" && (
                  <a onClick={handleLogout}>Logout</a>
                )}
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                {/* <Link to="/register">Register</Link> */}
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
