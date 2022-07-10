import React from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import OutlinedButton from '../buttons/OutlinedButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import BlogContext from '../../context/blog/BlogContext';
import { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import { db, storage } from '../../firebase';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ref, deleteObject } from 'firebase/storage';

const BlogSection = ({ blogs }) => {
    const obj = useContext(BlogContext);
    const media700px = useMediaQuery('(max-width:700px)');
    const media1080px = useMediaQuery('(max-width:1080px)');    

   const mediaQuery = ()=>
   {
     if(media700px)
    {
        return 1
    }
    else if (media1080px)
    {
        return 2
    }
    else{
        return 3
    }
   }

   let colCount = mediaQuery();
    

   //function for deleting the blog based on blog id
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
                return toast.success("Blog is deleted successfully!");
            } catch (error) {
                return (error);
            }
        }
    }
   
    let categoryString = "";
    const styledButton = {borderColor:"white",color:"white"}
    return (
        <>
            <ImageList id="dailyBlogSection" cols={colCount} gap={15} variant="masonry" sx={{margin:"0 auto",width:"95vw"}}>
            {/* blogs?.map means "blogs?blogs.map" */}
            {blogs?.map((item) => {
                return (
                    <ImageListItem sx={{width:"100%", background: purple[700], borderTop: "2px solid white", borderLeft: "2px solid white",pt: ".2rem", pb: ".2rem",borderRadius:"1rem"}} style={{marginBottom:"1rem"}} key={item.id}>
                    <header style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <Typography variant="overline" sx={{ background: purple[200], padding: ".8rem", color: purple[800], borderRadius: ".3rem",lineHeight:"0",fontWeight:"bolder" }}>
                                {item.category.map((item) => {
                                    return categoryString + item + " ";
                                })}
                            </Typography>
                    </header>
                    <CardHeader
                        sx={{color:"white"}}
                        avatar={
                            <Avatar sx={{ bgcolor: purple[300] }} aria-label="recipe">
                                <img style={{ maxWidth: '100%',objectFit: 'cover' }} src={item.authorPhotoURL} alt={item.author.toUpperCase()} />
                            </Avatar>
                        }
                        title={item.author.toUpperCase()}
                        subheader={<Typography variant="caption" color="white">
                            {`Created on ${obj.FormatedDate(item.created)}`}
                        </Typography>}
                        />
                    <figure style={{padding:'1rem',borderRadius:"7rem 0",background:purple[200],margin:".8rem"}}>
                    <CardMedia
                        component="img"
                                sx={{ maxWidth: "100%", maxHeight: '25rem', objectFit: "cover",borderRadius:"6rem 0"}}
                        image={item.imageUrl}
                        alt={item.title}
                    />
                    </figure>
                    <CardContent>
                        <Typography variant="h4" color="white">
                            {item.title}
                        </Typography>
                        <Typography variant="body1" color="white">
                            {obj.excerpt(item.description, 120)}
                        </Typography>
                        {item.updated ?
                                <Typography variant="overline" display="block" color="white" marginTop=".8rem">
                                   " Updated on  {obj.FormatedDate(item.updated)} "
                                </Typography>
                          : ''}
                    </CardContent>
                    <CardActions sx={{paddingTop:0}}>
                    
                        <Grid container spacing={1}>
                            <Grid item xs={6} md={8}>
                                <OutlinedButton text="Read More" link={`/detail/${item.id}`} style={styledButton}/>
                            </Grid>
                            {obj.userData?.uid && item.userId === obj.userData.uid &&
                                <Grid item xs={6} md={4}>
                                    <Stack spacing={2} direction="row">
                                        <Link to={`/update/${item.id}`}>
                                            <Fab color="secondary" aria-label="edit" size='small'>
                                                <EditIcon />
                                            </Fab>
                                        </Link>
                                        <Fab color="secondary" aria-label="delete" size='small'>
                                            <DeleteIcon onClick={() => { deleteBlog(item.id) }} />
                                        </Fab>
                                    </Stack>
                                </Grid>}
                        </Grid>
                    </CardActions>
                  
                    </ImageListItem>)
            })}

            </ImageList>
        </>
    );
}

export default BlogSection


