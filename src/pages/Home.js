import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { useEffect } from 'react';
import BlogSection from '../components/blogs/BlogSection';
import { db } from '../firebase';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BlogContext from '../context/blog/BlogContext';
import { useContext } from 'react';
import Spinner from '../components/Spinner';
import { purple } from '@mui/material/colors';
import TrendingBlogs from '../components/blogs/TrendingBlogs';


const Home = () => {
  const [blogs,setBlogs] = useState([]);
  const [trendingBlogs,setTrendingBlogs] = useState([]);
  const obj = useContext(BlogContext);

  
  useEffect(()=>
  {
    //whenever there is change in blog collection it runs
    const getTrendingBlogs = onSnapshot(query(collection(db, "blogs"), where("trending", "==", "Yes")),(snapshot)=>
    {
      let list = [];
      snapshot.docs.forEach((doc)=>
      {
        list.push({id:doc.id,...doc.data()});
      })
      setTrendingBlogs(list)
    },(err) => {
      return (err);
    })
    const getBlogs = onSnapshot(collection(db,"blogs"),(snapshot)=>
    {
      let list = [];
      snapshot.docs.forEach((doc)=>
      {
        list.push({id:doc.id,...doc.data()});
      })
      setBlogs(list);
      obj.setLoading(false);
    },(err) => {
      return (err);
    })

    return ()=>
    {
      getTrendingBlogs();
      getBlogs();
    }
  },[obj])

  if(obj.loading)
  {
    return (
     <Spinner/>
    );
  }

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Typography variant="h5" component="div" sx={{ textAlign: "center", margin: "1rem", background: purple[700], padding: ".5rem", color: "white", borderRadius: ".3rem", borderTop: "1px solid white", borderLeft: "1px solid white" }}>
            Trending Blogs
          </Typography>
          {trendingBlogs.length !==0 ? <TrendingBlogs blogs={trendingBlogs} /> : <Typography variant='h4' color="white" margin="4rem" textAlign="center">OOPS! No Trending Blogs Found</Typography>
         } 
        
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h5" component="div" sx={{ textAlign: "center", margin: "1rem", background: purple[700], padding: ".5rem", color: "white", borderRadius: ".3rem", borderTop: "1px solid white", borderLeft: "1px solid white" }}>
            Daily Blogs
          </Typography>
          {blogs.length !== 0 ? <BlogSection blogs={blogs} /> : <Typography variant='h4' color="white" marginTop="5rem" textAlign="center">OOPS! No Daily Blogs Found</Typography>} 
        </Grid>
  
      </Grid>
    </div>
  )
}

export default Home