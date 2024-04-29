import './App.css';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { UserContextProvider } from './context/UserContext';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';
import Index from './pages/Index';
import Blog from './pages/Blog';
import Profile from './pages/Profile';


function App() {
  
  return (
    
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path='/blog' element={<Blog /> } />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
     
        
      </Routes>
    </UserContextProvider>
   
   
  );
}

export default App;
