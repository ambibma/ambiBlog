
import './App.css';
import Header from './components/Header';
import Layout from './components/Layout';
import Post from './components/Post';
import {Routes, Route} from 'react-router-dom'
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';

function App() {
  return (
      <UserContextProvider>
    <Routes>
        <Route path="/" element={<Layout/>}>  
          <Route index element={<IndexPage/>}/>
          <Route path={'/login'} element={<LoginPage/>}/>
          <Route path={'/register'} element={<RegisterPage/>}/>
        </Route>
    </Routes>
    </UserContextProvider>
    
  );
}


export default App;

