const { createContext, useState } = require("react");

export const UserContext = createContext({});

export function UserContextProvider ({children}) {
  const [userInfo, setUserInfo] = useState({});
  const [userRole, setUserRole] = useState({});

  return (
    <UserContext.Provider value={{userInfo, setUserInfo, userRole, setUserRole}}>
    {children}
    </UserContext.Provider>
    )
}

