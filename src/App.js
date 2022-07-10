import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Detail from './pages/Detail';
import AddBlog from './pages/AddBlog';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Navbar from './components/navigation/Navbar';
import OtherBlogs from './pages/OtherBlogs';
import { purple } from '@mui/material/colors';
import BlogContext from './context/blog/BlogContext';
import { useContext, useEffect } from 'react';
import { auth } from './firebase';
import YourBlogs from './pages/YourBlogs';
import Footer from './components/Footer';
import Spinner from './components/Spinner';

function App() {
  document.body.style.background = purple[900];
  const obj = useContext(BlogContext);
  useEffect(() => {
   auth.onAuthStateChanged(authUser =>{
    if(authUser)
    {
      obj.setUserData(authUser);
      obj.setLoading(false);
    }
    else
    {
      obj.setUserData(null)
      obj.setLoading(false);
    }
   })
  }, [obj])
  
  if (obj.loading) {
    return (
      <Spinner />
    );
  }

  return (
    <>
    <div className="App" style={{ minHeight: '100vh' }}> 
      <Navbar/>
      <ToastContainer position='top-center'/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/otherblogs/*' element={<OtherBlogs />} />
          <Route path='/detail/:id' element={<Detail />} />
        {obj.userData !== null &&<Route path='/create' element={<AddBlog/>} />}
        {obj.userData !== null &&<Route path='/update/:id' element={<AddBlog />} />}
        {obj.userData !== null &&<Route path='/yourblogs/*' element={<YourBlogs />} />}
          <Route path='/about' element={<About />} />
    
          <Route path='*' element={<NotFound />} />
        </Routes>
       </div>
        <Footer/>
       </>
  );
}

export default App;
