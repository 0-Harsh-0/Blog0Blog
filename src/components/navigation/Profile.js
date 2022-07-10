import React, { useContext,useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { purple } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import BlogContext from '../../context/blog/BlogContext';
import {db, storage } from "../../firebase";
import { updateDoc, collection, getDoc, getDocs, query, where, doc,setDoc} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable,deleteObject } from 'firebase/storage';
import { getAuth, updateProfile } from "firebase/auth";
import Uploading from '../Uploading';


const theme = createTheme({
    components: {
        // Name of the component
        MuiDialog: {
            styleOverrides: {
                // Name of the slot
                paper: {
                    background: purple[700],
                    borderTop: "2px solid white",
                    borderLeft: "2px solid white",
                    paddingBottom: ".2rem",
                    borderRadius: "1rem",
                    color: "white",
                    padding: "1rem",
                    paddingTop: 0,
                    maxWidth: ""
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: { 
                    backgroundColor: purple[400],
                    color: "white",
                    transition: "color .8s linear",
                    borderTop: "1px solid white",
                    borderLeft: "1px solid white",
                    borderRadius: ".4rem",
                   "&:hover":
                   {
                       backgroundColor: purple[400],
                   } 
                },
            },
        },
    },
});

const Profile = ({funtionName}) => {
    const obj = useContext(BlogContext);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const threeDotOpen = Boolean(anchorEl);
    const auth = getAuth();
    const [uploading,setUploading] = useState(0)
    const [success,setSuccess] = useState(false);

    useEffect(() => {
        const uploadFile = async() => {
            //creating a unique string value
            const uniqueString = obj.makeid(5)
            //creating the profile image name
            const profileImgName = uniqueString + obj.file.name;
            //creating storage reference means where the file is stored in storage
            const storageRef = ref(storage, `${obj.userData.uid}/ProfileImages/${profileImgName}`);

            //initializing the function for uploading image
            const uploadTask = uploadBytesResumable(storageRef, obj.file);

            //this function is used for getting state of file which is currently uploading
            uploadTask.on("state_changed", (snapshot) => {
                const progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if(uploading === 0)
                {
                    setUploading(2);
                }
              
                 setUploading(progress);
                
            }, (error) => {
                console.log(error);
            }, () => {
                //this function is used to get the url of uploaded image
                getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl=> {

                    //updating the profile picture url after getting downloadurl
                    updateProfile(auth.currentUser, {
                        photoURL: downloadUrl,
                    }).then( async () => {
                        //creating reference of blog collection
                        const blogRef = collection(db, "blogs");
                        
                        //creating the blog query for getting the blog based on logged in user id
                        const blogQuery = query(blogRef, where("userId", "==", obj.userData.uid));

                        //getting the blogs
                        const querySnapshot = await getDocs(blogQuery);
                        querySnapshot.forEach(async (document) => {
                            // updating loggedin user's every single blog's author photo
                            await updateDoc(doc(db, "blogs", document.id), { authorPhotoURL: downloadUrl })
                        })
                        setSuccess(true)
                        setUploading(0)
                        obj.setFile(null);
                        setTimeout(() => {
                            setSuccess(false)
                        }, 2000);

                    }).catch((error) => {
                        return error
                    })
                })
            }
            )
            try {
                //creating the reference of particular document from profileImageNames collection
                const docRef = doc(db, "ProfileImageNames", obj.userData.uid);

                //getting that particular document
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    //creating the reference of saved profile image
                    const storageRef = ref(storage, `${obj.userData.uid}/ProfileImages/${docSnap.data().authorImageName}`);
                    //deleting that image
                    deleteObject(storageRef).then().catch((error) => { return error })
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }

                //adding the new document in profileImageNames collection
                //if it is already exists then it overwrites the data
                await setDoc(doc(db, "ProfileImageNames", obj.userData.uid), {
                    authorImageName: profileImgName
                })
            }
            catch (error) {
                console.log(error);
            }
        }
        obj.userData !==null && obj.file!==null && uploadFile();
        // eslint-disable-next-line
    }, [obj,obj.file, auth.currentUser])

    const [created,setCreated] = React.useState(0);
    const [trending, setTrending] = React.useState(0);
    const [updated, setUpdated] = React.useState(0);
    useEffect(()=>
    {
        const getBlogs = async()=>
        {
            let createdBlogs=[];
            let trendingBlogs = [];
            let notUpdatedBlogs = [];

            //creating the reference of blogs collection
            const blogRef = collection(db, "blogs");

            //creating the blogquery for getting created blogs based on current logged in user id
            const createdBlogQuery = query(blogRef, where("userId", "==", obj.userData.uid));

            //creating the blogquery for getting trending blogs based on createdBlogQuery
            const trendingBlogQuery = query(createdBlogQuery, where("trending", "==", 'Yes'));

            //creating the blogquery for getting non-updated blogs based on createdBlogQuery
            const updatedBlogQuery = query(createdBlogQuery, where("updated", "==", null));

            //getting the blogs according to the queries
            const querySnapshot1 = await getDocs(createdBlogQuery);
            const querySnapshot2 = await getDocs(trendingBlogQuery);
            const querySnapshot3 = await getDocs(updatedBlogQuery);

            //Iterating through each query snapshot and storing the data into lists
            querySnapshot1.forEach((document)=>
            {
                createdBlogs.push({...document.data() })
            })
            querySnapshot2.forEach((document)=>
            {
                trendingBlogs.push({...document.data() })
            })
            querySnapshot3.forEach((document)=>
            {
                notUpdatedBlogs.push({...document.data() })
            })

            setCreated(createdBlogs.length);
            setTrending(trendingBlogs.length);
            setUpdated(createdBlogs.length - notUpdatedBlogs.length)
        }
        obj.userData !== null && getBlogs()
    })

    const clickOnThreeDot = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const Close = () => {
        setAnchorEl(null);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        funtionName();
    };
    
    const imageButtonStyle = {
        backgroundColor: purple[700],
        color: "white",
        borderTop: "1px solid white",
        borderLeft: "1px solid white",
        borderRadius: ".4rem",
        padding:'.3rem',
        '&:hover':
        {
            backgroundColor: purple[700],
        }
    }

    const media740px = useMediaQuery('(max-width:740px)');    

    const uploadProfilePhoto = ()=>{
        document.getElementById('profilePhoto').click();
    }

    return (
        <React.Fragment>
            <MenuItem onClick={handleClickOpen}>
                <ListItemIcon>
                    <AccountCircleIcon fontSize="medium" sx={{ color: purple[900], }} />
                </ListItemIcon>
                Profile
            </MenuItem>
            <ThemeProvider theme={theme}>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                   {uploading !== 0 && <Uploading uploading={uploading}/>}
                   {success && <Uploading uploaded={success} text='Uploaded Successfully !' />}
                <DialogActions>
                        <Fab onClick={handleClose} color="secondary" aria-label="delete" size='small' sx={{ zIndex: 10, width:'2.2rem', height:'1rem', '&:hover': { background: purple[300] } }}>
                            <CloseIcon size="large" sx={{ fontSize:{xs:'1.5rem'}, cursor: "pointer" }} />
                        </Fab>
                </DialogActions>
                <DialogTitle textAlign="center" sx={{padding:0}}>       
                            Profile
                </DialogTitle>
                <DialogContent sx={{margin:0,padding:0,overflowY:'scroll',overflowX
            :'none'}}>
                        <Grid container alignItems="center" justifyContent='center'>

                            <Grid item xs={12} sm={6} md={6}>
                           
                                <figure style={{ position: 'relative', padding: '1rem', borderRadius: "7rem 0", background: purple[200] , margin:`${media740px?'.8rem':'1rem'}`}}>
                                    <CardMedia
                                        component="img"
                                        sx={{ maxWidth: "100%", maxHeight: '20rem', objectFit: "cover", borderRadius: "6rem 0" }}
                                        image={obj.userData ? obj.userData.photoURL : ''}
                                        alt={obj.userData ? obj.userData.displayName : ''}
                                   
                                    />
                                <div style={{position:'absolute',top:0,right:-15}}>
                                    <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={threeDotOpen ? 'long-menu' : undefined}
                                        aria-expanded={threeDotOpen ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={clickOnThreeDot}
                                    >
                                        <MoreVertIcon sx={{fontSize:'2rem',color:"white"}}/>
                                    </IconButton>
                                    <Menu
                                        id="long-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'long-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={threeDotOpen}
                                        onClose={Close}
                                        PaperProps={{
                                         sx : {
                                            borderLeft: "2px solid white",
                                            borderTop: "2px solid white",
                                            background: purple[300],
                                            color: 'white',
                                            padding:'0 .4rem'
                                          }
                                        }}
                                    >
                                        
                                            <MenuItem onClick={uploadProfilePhoto} sx={imageButtonStyle} style={{marginBottom:".4rem"}}>
                                                <ListItemIcon>
                                                    <UploadFileIcon sx={{color:'white'}} fontSize="medium"/>
                                                </ListItemIcon>
                                                upload
                                                <input type="file" id="profilePhoto" hidden name="profilePhoto" onChange={(e) => {
                                                    obj.setFile(e.target.files[0])
                                                    Close()   
                                                }} />
                                            </MenuItem>
                                     
                                    </Menu>
                                </div>
                                </figure>
                        </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                            <Stack gap={2}>
                                {/* Name */}
                                <Stack direction="row" gap={1} alignItems="center">
                                        <Typography variant='h6'>
                                            Name
                                        </Typography>
                                        <ArrowRightIcon sx={{fontSize:'2rem'}}/>
                                        <Typography variant='h6'>
                                            {obj.userData?.displayName}
                                        </Typography>
                                </Stack>

                                {/* Email  */}
                                <Stack direction="row" gap={1} alignItems="center" >
                                        <Typography variant='h6'>
                                            Email 
                                        </Typography>
                                        <ArrowRightIcon sx={{ fontSize: '2rem'}}/>
                                        <Typography variant='h6' >
                                           {obj.userData?.email}
                                        </Typography>
                                </Stack>

                                {/* cretaed blogs  */}
                                <Stack direction="row" gap={1} alignItems="center">
                                        <Typography variant='h6'>
                                            Created Blogs
                                        </Typography>
                                        <ArrowRightIcon sx={{fontSize:'2rem'}}/>
                                        <Typography variant='h6'>
                                            {created}
                                        </Typography>
                                </Stack>

                                {/* updated blogs  */}
                                <Stack direction="row" gap={1} alignItems="center">
                                        <Typography variant='h6'>
                                            Updated Blogs
                                        </Typography>
                                        <ArrowRightIcon sx={{fontSize:'2rem'}}/>
                                        <Typography variant='h6'>
                                            {updated}
                                        </Typography>
                                </Stack>

                                {/* Trending blogs  */}
                                <Stack direction="row" gap={1} alignItems="center">
                                        <Typography variant='h6'>
                                            Trending Blogs
                                        </Typography>
                                        <ArrowRightIcon sx={{fontSize:'2rem'}}/>
                                        <Typography variant='h6'>
                                            {trending}
                                        </Typography>
                                </Stack>

                                {/* Account Creation Date  */}
                                <Stack direction="row" gap={1} alignItems="center">
                                        <Typography variant='h6'>
                                            Account Created
                                        </Typography>
                                        <ArrowRightIcon sx={{fontSize:'2rem'}}/>
                                        <Typography variant='h6'>
                                            {obj.FormatedDate(obj.userData?.metadata.creationTime)}
                                        </Typography>
                                </Stack>
                            </Stack>
                        </Grid>

                   </Grid>
                
                </DialogContent>
             
            </Dialog>
            </ThemeProvider>
        </React.Fragment>
    );
}

export default Profile