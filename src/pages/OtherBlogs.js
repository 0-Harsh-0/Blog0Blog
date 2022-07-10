import React, {useState,useEffect,useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { purple } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BlogContext from '../context/blog/BlogContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import BlogSection from '../components/blogs/BlogSection';
import Spinner from '../components/Spinner';
import { Link,useLocation,Routes,Route } from 'react-router-dom';

const theme = createTheme({
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.active":
          {
            backgroundColor: purple[400],
            color: "white",
            transition: "color .8s linear",
            borderTop:"1px solid white",
            borderLeft:"1px solid white",
            borderRadius:".4rem",
          }
        },
      },
    },
  },
});




const OtherBlogs = () => {
  const [categorisedBlogs,setCateogrisedBlogs] = useState({});
  const obj = useContext(BlogContext);
  const categoryOption = obj.categoryOption;
  const location = useLocation();
  
  useEffect(() => {
    const slashIndex = location.pathname.lastIndexOf("/");
    obj.setOtherBlogURL(location.pathname.slice(slashIndex + 1,))
    const getBlogs = onSnapshot(collection(db, "blogs"), (snapshot) => {
      let list = [];
      let Fashion = [];
      let Technology = [];
      let Food = [];
      let Politics = [];
      let Sports = [];
      let Business = [];
      let blogDict = {}
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      })
  
      list.forEach((item,index)=>
      {
        item.category.forEach((category)=>
        {
          if (category === categoryOption[0])
          {
            Fashion.push(item) 
            blogDict[category] = Fashion
          }
          else if (category === categoryOption[1])
          {
            Technology.push(item) 
            blogDict[category] = Technology
          }
          else if (category === categoryOption[2])
          {
            Food.push(item) 
            blogDict[category] = Food
          }
          else if (category === categoryOption[3])
          {
            Politics.push(item) 
            blogDict[category] = Politics
          }
          else if (category === categoryOption[4])
          {
            Sports.push(item) 
            blogDict[category] = Sports
          }
          else if (category === categoryOption[5])
          {
            Business.push(item) 
            blogDict[category] = Business
          }
        })
      })
      setCateogrisedBlogs(blogDict)

      obj.setLoading(false);
    }, (err) => {
      console.log(err);
    })

    return () => {
      getBlogs();
    }
  }, [obj,categoryOption,location.pathname])

  if (obj.loading) {
    return (
      <Spinner />
    );
  }


  return (
    <ThemeProvider theme={theme}>
    <Box sx={{width:"100%"}}>
        <AppBar position='static' sx={{width:"auto",margin: "1rem", background: purple[700], borderRadius: ".3rem", borderTop: "1px solid white", borderLeft: "1px solid white",padding:".3rem" }}>
            <Grid container sx={{justifyContent:"center",alignItems:'center'}}>
          {categoryOption.map((item,index)=>
          {
            return <Grid item key={index}>
              <Button className={location.pathname === `/otherblogs/${item.toLowerCase()}` ? "active" : "notActive"} component={Link} to={`/otherblogs/${item.toLowerCase()}`} sx={{ color: "white" }} onClick={() => { obj.changeOtherBlogUrl(item.toLowerCase())}}>{item}</Button></Grid>

          })}
            </Grid>
        </AppBar>

      <Box>
          <Routes>
            {categoryOption.map((item, index) => {
              if (categorisedBlogs[item] !== undefined) {
                return <Route key={item + index} path={`/${item.toLowerCase()}`} element={
                  <BlogSection key={item} blogs={categorisedBlogs[item]} />
                } />
              }
              else {
                return <Route key={item + index} path={`/${item.toLowerCase()}`} element={
                  <Typography variant='h4' color="white" marginTop="7rem" textAlign="center">OOPS! No Blogs Found</Typography>
                } />
              }


            })}

          </Routes>
    
        </Box>
    </Box>
    </ThemeProvider>
  );
}


export default OtherBlogs