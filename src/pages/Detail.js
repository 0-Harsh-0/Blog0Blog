import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { db,storage } from '../firebase';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import BlogContext from '../context/blog/BlogContext';
import { useContext } from 'react';
import { purple } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import useMediaQuery from '@mui/material/useMediaQuery';

const Detail = () => {
  const obj = useContext(BlogContext);
  const {id} = useParams();
  const [blog,setBlog] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure to delete this blog ?")) {
      try {
        //creating the blog reference
        const docRef = doc(db, "blogs", id);
        //getting the blog
        const blogDetail = await getDoc(docRef);
        //getting the blog image
        const imageRef = ref(storage, `${blogDetail.data().userId}/BlogImages/${blogDetail.data().imageName}`);
        //deleting the blogimage from database
        deleteObject(imageRef)
        //deleting the blog from database
        await deleteDoc(doc(db, "blogs", id));
        if (location.pathname === `/detail/${id}`) {
          navigate("/");
          return toast.success("Blog is deleted successfully!");
        }
      } catch (error) {
        return console.log(error);
      }
    }
  }

  useEffect(()=>
  {
    const getBlogDetail = async ()=>
    {
      const docRef = doc(db,"blogs",id);
      const blogDetail = await getDoc(docRef);
      setBlog(blogDetail.data());
    }

    id && getBlogDetail();
  }, [id])

  const media1080px = useMediaQuery('(max-width:1080px)');


  let categoryString = "";
  return (
    blog && <article style={{background: purple[700], borderTop: "2px solid white", borderLeft: "2px solid white", pt: ".2rem", pb: ".2rem", borderRadius: "1rem",margin:"1rem" }}>
        <Grid container spacing={1} alignItems="center" justifyContent="center">
         <Grid item xs={12} sm={12} md={media1080px?6:5} >
            <figure style={{ padding: '1rem', borderRadius: "7rem 0", background: purple[200], margin: ".8rem" }}>
              <CardMedia
                component="img"
                sx={{ maxWidth: "100%", objectFit: "cover", borderRadius: "6rem 0" }}
                image={blog.imageUrl}
                alt={blog.title}
              />
            </figure>
          </Grid>
        <Grid item xs={12} sm={12} md={media1080px?6:7} alignSelf="start" marginTop=".3rem">
            <header style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography variant="overline" sx={{ background: purple[200], padding: ".8rem", color: purple[800], borderRadius: ".3rem", lineHeight: "0", fontWeight: "bolder" }}>
                {blog.category.map((item) => {
                  return categoryString + item + " ";
                })}
              </Typography>
            </header>
            <CardHeader
              sx={{ color: "white" }}
              avatar={
                <Avatar sx={{ bgcolor: purple[300] }} aria-label="recipe">
                  {blog.author.slice(0, 1).toUpperCase()}
                </Avatar>
              }
              title={blog.author.toUpperCase()}
              subheader={<Typography variant="caption" color="white">
                {`Created on ${obj.FormatedDate(blog.created)}`}
              </Typography>}
            />
            <CardContent style={{minHeight:"10rem"}}>
              <Typography variant="h4" color="white">
                {blog.title}
              </Typography>
              <Typography variant="body1" color="white">
                {blog.description}
              </Typography>
              {blog.updated ?
                <Typography variant="overline" display="block" color="white" marginTop=".8rem">
                  " Updated on  {obj.FormatedDate(blog.updated)} "
                </Typography>
                : ''}
            </CardContent>
            <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={8} sm={9} md={media1080px?9:10}>
                <Stack direction="row" gap={1} marginBottom=".5rem" justifyContent="center" alignItems="center">
             
                {blog.tag.map((item,index)=>
                {
                  return (<Typography key={item + index} variant="overline" sx={{
                    backgroundColor: purple[400],
                    color: "white",
                    transition: "color .8s linear",
                    borderTop: "1px solid white",
                    borderLeft: "1px solid white",
                    borderRadius: ".4rem",
                    padding:"0 .4rem"}}>
                    {item}
                </Typography>)
                })}
                </Stack>
            </Grid>

            {obj.userData?.uid && blog.userId === obj.userData.uid ?
              <Grid item xs={4} sm={3} md={media1080px?3:2}>
                    <Stack spacing={2} direction="row" marginBottom=".5rem" justifyContent="center">
                      <Link to={`/update/${id}`}>
                        <Fab color="secondary" aria-label="edit" size='small'>
                          <EditIcon />
                        </Fab>
                      </Link>
                      <Fab color="secondary" aria-label="delete" size='small'>
                        <DeleteIcon onClick={() => { deleteBlog(id) }} />
                      </Fab>
                    </Stack>
              </Grid>
                  : ''}
                </Grid>
          </Grid>
      
        </Grid>

    </article>
  )
}

export default Detail





