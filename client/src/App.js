import './App.css';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';
import HomePage from './pages/HomePage';

import Blog from './pages/Blog';



function App() {
  
  return (
    
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
           <Route path='/blog' element={<Blog /> } />
          <Route path="/post/:id" element={<PostDetails />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </UserContextProvider>
   
   
  );
}

export default App;
