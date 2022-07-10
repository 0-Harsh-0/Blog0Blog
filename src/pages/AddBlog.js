import React, { useContext, useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BlogContext from '../context/blog/BlogContext';
import ContainedButton from '../components/buttons/ContainedButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { purple } from '@mui/material/colors';
import InputLabel from '@mui/material/InputLabel';
import InputBase from '@mui/material/InputBase';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { TagsInput } from "react-tag-input-component";
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import ".././utility/utility.css"
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import useMediaQuery from '@mui/material/useMediaQuery';
import Uploading from '../components/Uploading';
import { deleteObject } from 'firebase/storage';

const categoryOption = [
  "Fashion", "Technology", "Food", "Politics", "Sports", "Business"
]


const CustomInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    padding: '10px 26px 10px 12px',
    backgroundColor: purple[400],
    color: "white",
    transition: "color .8s linear",
    borderTop: "2px solid white",
    borderLeft: "2px solid white",
    borderRadius: ".4rem",
    '&:focus': {
      borderColor: 'white',
    },
    '&:focus-within': {
      border: '2px solid white',
      borderRadius: ".4rem",
      backgroundColor: purple[400],
    },
  },
}));

const AddBlog = () => {
  const obj = useContext(BlogContext);
  const navigate = useNavigate();
  const [notUploaded, setNotUploaded] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [previousImageUrl, setPreviousImageUrl] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [previousImageName, setPreviousImageName] = useState(null);
  const [created_, setCreated] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadingDone, setUploadingDone] = useState(false);
  const [blogImageName, setBlogImageName] = useState(null);
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disable,setDisable] = useState(false);


  const buttonStyle = {
    width: "60%", letterSpacing: "3px", backgroundColor: purple[400],
    color: "white",
    transition: "color .8s linear",
    borderTop: "2px solid white",
    borderLeft: "2px solid white",
    borderRadius: ".4rem",
  }

  const [trending, setTrending] = React.useState("No");
  const [existingImage, setExistingImage] = React.useState("Yes");
  const [category, setCategory] = React.useState([]);
  const { id } = useParams();
  const location = useLocation();
  const check = location.pathname === "/create"
  const navigation = window.navigation;


  useEffect(() => {
    setTitle("");
    setDescription("");
    setTrending("No");
    setCategory([]);
    setTag([]);
    setCreated(null)

  }, [check])


  navigation.oncurrententrychange = () => {
    navigation.oncurrententrychange = null
    if(uploadingDone && checked)
    {
      const storageRef = ref(storage, `${obj.userData.uid}/BlogImages/${blogImageName}`);
      deleteObject(storageRef).then().catch((error) => { return error })
      if (!id) {
        return toast.error("Blog Creation Failed!")
      }
    }
  };

  useEffect(() => {
    const uploadFile = () => {
       //creating a unique string value
      const uniqueString = obj.makeid(5)
      //creating the blog image name
      const blogImgName = uniqueString + obj.blogFile.name;
      setBlogImageName(blogImgName)
      setNotUploaded(true);

      //creating storage reference means where the file is stored in storage
      const storageRef = ref(storage, `${obj.userData.uid}/BlogImages/${blogImgName}`);

      //initializing the function for uploading image
      const uploadTask = uploadBytesResumable(storageRef, obj.blogFile);

      //this function is used for getting state of file which is currently uploading
      uploadTask.on("state_changed", (snapshot) => {
        const progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (uploadPercentage === 0) {
          setUploadPercentage(2)
        }
        setUploadPercentage(progress);
      }, (error) => {
        return true
      }, () => {
        //this function is used to get the url of uploaded image
        obj.set_File_ !== null && getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
          setSuccess(true)
          setUploadPercentage(0);
          setImageUrl(downloadUrl);
          setImageName(blogImgName);
          obj.set_File_(null)
          setNotUploaded(false)
          setUploadingDone(true)
          setTimeout(() => {
            setSuccess(false)
          }, 2200);
        })
      }
      )
      //this function runs when user change the url
      navigation.oncurrententrychange = () => {
        obj.set_File_(null)
        setUploadPercentage(0);
        setNotUploaded(false)
        setSuccess(false);
        navigation.oncurrententrychange = null
        //canceling the uploading task
        uploadTask.cancel();
        //deleting the image
        deleteObject(storageRef).then().catch((error) => { return error });
        if (!id) {
          return toast.error("Blog Creation Failed!")
        }
      }
    }



    obj._file_ !== null && (checked && uploadFile());

    // eslint-disable-next-line
  }, [checked, obj.URL, obj.blogFile, obj._file_])


  useEffect(() => {
    const getBlogDetail = async () => {
      const docRef = doc(db, "blogs", id);
      const blogDetail = await getDoc(docRef);
      if (blogDetail.exists()) {
        let data = blogDetail.data();
        setTitle(data.title);
        setDescription(data.description);
        setTrending(data.trending);
        setCategory(data.category);
        setTag(data.tag);
        setImageUrl(data.imageUrl);
        setCreated(data.created);
        setPreviousImageUrl(data.imageUrl);
        setPreviousImageName(data.imageName);
      }
    }

    id && getBlogDetail();
  }, [id])




  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const changeTitleValue = (event) => {
    setTitle(event.target.value);
  };

  const changeDescriptionValue = (event) => {
    setDescription(event.target.value);
  };



  const createBlog = async () => {
    if (title === "" && description === "" && tag.length === 0 && category.length === 0 && obj.blogFile === null) {
      return toast.error("All fields are mandatory")
    }
    else if (obj.isStartsWithWhiteSpace(title)) {
      return toast.error("Title can not starts with space!")
    }
    else if (title === "") {
      return toast.error("Please enter title!");
    }
    else if (description === "") {
      return toast.error("Please enter description!")
    }
    else if (tag.length === 0) {
      return toast.error("Please enter tag!")
    }
    else if (category.length === 0) {
      return toast.error("Please choose category!")
    }
    else if (existingImage === "No" && obj.blogFile === null) {
      return toast.error("Please choose the file!")
    }
    else if (existingImage === "No" && !checked) {
      return toast.error("Please check the upload checkbox!")
    }
    else {
      if (id) {
        try {
          setDisable(true);
          //this function is used for updating the blog based on blog id
          await updateDoc(doc(db, "blogs", id), {
            userId: obj.userData.uid,
            author: obj.userData.displayName,
            authorPhotoURL: obj.userData.photoURL,
            title,
            description,
            tag,
            category,
            trending,
            imageUrl,
            imageName,
            created: created_,
            updated: Date()
          })
          if (obj.blogFile !== null) {
            const storageRef = ref(storage, `${obj.userData.uid}/BlogImages/${previousImageName}`);
            deleteObject(storageRef).then().catch((error) => { return error })
          }
          setTitle("");
          setDescription("");
          setTag([]);
          setTrending("No");
          setCategory([]);
          setChecked(false);
          setUploadingDone(false);
          obj.setBlogFile(null);
          setTimeout(() => {
            navigate("/")
            return toast.success(`"${title}" Blog is updated successfully!`)
          }, 200);
        } catch (err) {
          return toast.error(err);
        }
      }
      else if (obj.blogFile === null) {
        return toast.error("Please choose the file!")
      }
      else if (!checked) {
        return toast.error("Please check the upload checkbox!")
      }
      else {
        try {
          setDisable(true);
          //add the blog to blogs collections
          await addDoc(collection(db, "blogs"), {
            userId: obj.userData.uid,
            author: obj.userData.displayName,
            authorPhotoURL: obj.userData.photoURL,
            title,
            description,
            tag,
            category,
            trending,
            imageUrl,
            imageName,
            created: Date(),
            updated: null
          })
          setTitle("");
          setDescription("");
          setTag([]);
          setTrending("No");
          setCategory([]);
          setChecked(false);
          setUploadingDone(false);
          obj.setBlogFile(null);
          document.getElementById("blogImage").value = "";
          while (document.querySelector(".rti--container").firstElementChild.localName !== "input") {
            document.querySelector(".rti--container").children[0].remove();
          }
          setDisable(false);
          return toast.success(`"${title}" Blog is created successfully!`)
        } catch (err) {
          return toast.error(err);
        }
      }


    }
  }

  const tagsInput = <TagsInput
    value={tag}
    onChange={setTag}
    name="Tags"
    label="Tags"
    placeHolder="Enter Tag"

  />

  const media1160px = useMediaQuery('(max-width:1160px)');
  const media500px = useMediaQuery('(max-width:500px)');

  const uploadFile = (e) => {
    if (e.target.files[0] === undefined) {
      obj.set_File_(null)
      obj.setBlogFile(null)
    }
    else {
      obj.set_File_(e.target.files[0])
      obj.setBlogFile(e.target.files[0])
    }

  }

  const handleCheckbox = () => {
    setChecked(!checked);
    if (checked) {
      //is user uncheck the upload checkbox after uploading image then is delete the uploaded image and empty the value of 'file input'
      const storageRef = ref(storage, `${obj.userData.uid}/BlogImages/${blogImageName}`);
      deleteObject(storageRef).then().catch((error) => { return error })
      obj.setBlogFile(null);
      document.getElementById("blogImage").value = "";
    }
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { width: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
      <Card sx={{ background: purple[700], borderTop: "2px solid white", borderLeft: "2px solid white", pt: ".2rem", pb: ".2rem", borderRadius: "1rem", margin: "1rem" }}>
        {uploadPercentage !== 0 && <Uploading uploading={uploadPercentage} />}
        {success && <Uploading uploaded={success} text='Uploaded Successfully !' />}
        <CardContent>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem", gap: '1rem'}}>

            <Typography variant="h4" sx={{ color: 'white', textAlign: "center", width: `${media500px ? "80%" : "95%"}` }}>{id ? "Update Your Blog" : "Create Your Blog"}</Typography>

            <Fab component={Link} to="/" color="secondary" aria-label="delete" size='small' style={{zIndex:10}}>
              <CloseIcon size="large" sx={{ fontSize: "1.8rem", cursor: "pointer" }} />
            </Fab>
          </div>


          <Grid container rowSpacing={2} alignItems="center" justifyContent="center">

            <Grid item xs={12} sm={12} md={media1160px ? 6 : 7}>
              <Stack spacing={2} id="formFields">

                <FormControl variant="standard" sx={{ margin: 0 }}>
                  <InputLabel htmlFor="demo-customized-textbox" sx={{ zIndex: 1, color: "white", fontSize: "1.5rem", '&.Mui-focused': { top: 0, left: 0, color: 'white' }, left: `${title === '' ? '.6rem' : '0'}`, top: `${title === '' ? '.5rem' : '0'}` }}>Title</InputLabel>
                  <CustomInput name='title' id="demo-customized-textbox" autoComplete='off' placeholder='Title' value={title} onChange={changeTitleValue} />
                </FormControl>


                <FormControl variant="standard" sx={{ margin: 0 }}>
                  <InputLabel htmlFor="demo-customized-textbox" sx={{ zIndex: 1, color: "white", fontSize: "1.5rem", '&.Mui-focused': { top: 0, left: 0, color: 'white' }, left: `${description === '' ? '.6rem' : '0'}`, top: `${description === '' ? '.5rem' : '0'}` }}>Descritption</InputLabel>
                  <CustomInput name="description" id="demo-customized-textbox" autoComplete='off' placeholder='Descritption' value={description} onChange={changeDescriptionValue} multiline
                    rows={4} />
                </FormControl>

                {(id && created_) && tagsInput}
                {(!id && !created_) && tagsInput}

              </Stack>
            </Grid>
            <Grid item xs={12} sm={12} md={media1160px ? 6 : 5}>
              <Stack spacing={2} alignItems="center" justifyContent="center" marginLeft=".5rem">

                <FormControl>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{
                      fontSize: "1.6rem", color: "white", '&.Mui-focused': {
                        color: 'white'
                      },
                    }}>Is It Trending Blog ?</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={trending}
                      onChange={(e) => { setTrending(e.target.value) }}
                    >
                      <FormControlLabel sx={{ color: "white" }} value="Yes" control={<Radio
                        sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: 28,
                            color: 'white'
                          },
                        }}
                      />} label="Yes" />
                      <FormControlLabel sx={{ color: "white" }} value="No" control={<Radio
                        sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: 28,
                            color: "white"
                          },
                        }}
                      />} label="No" />

                    </RadioGroup>
                  </Stack>
                </FormControl>

                <FormControl variant="standard" sx={{ width: "100%", margin: 0 }}>
                  <InputLabel htmlFor="demo-multiple-name-label" sx={{ zIndex: 1, color: "white", fontSize: "1.5rem", '&.Mui-focused': { top: 0, left: ".3rem", color: 'white' }, left: `${category.length === 0 ? '.8rem' : '.3rem'}`, top: `${category.length === 0 ? '.5rem' : '0'}` }}>Blog Category</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={category}
                    onChange={handleChange}
                    input={<CustomInput placeholder='Blog Cateogry' />}
                    sx={{ color: 'white', margin: '0 .3rem' }}
                  >
                    {categoryOption.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {id ? <FormControl>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{
                      fontSize: "1.6rem", color: "white", '&.Mui-focused': {
                        color: 'white'
                      },
                    }}>Upload Existing Image?</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={existingImage}
                      onChange={(e) => {
                        setExistingImage(e.target.value)
                        if(existingImage === "No")
                        {
                          setImageUrl(previousImageUrl);
                        } 
                       }}
                    >
                      <FormControlLabel sx={{ color: "white" }} value="Yes" control={<Radio
                        sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: 28,
                            color: 'white'
                          },
                        }}
                        disabled={obj.blogFile !== null && true}
                      />} label="Yes" />
                      <FormControlLabel sx={{ color: "white" }} value="No" control={<Radio
                        sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: 28,
                            color: "white"
                          },
                        }}
                        disabled={obj.blogFile !== null && true}
                      />} label="No" />

                    </RadioGroup>
                  </Stack>
                </FormControl>
                  : <Stack direction='row' gap={3} sx={{ width: "97%", justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '100%' }}>

                      <input type="file" accept="image/png, image/jpeg, image/jpg" name="blogImage" id="blogImage" onChange={uploadFile} style={{ width: '100%' }} disabled={(checked && true) || (notUploaded !== null && notUploaded)} />
                    </div>

                    <FormControlLabel control={<Checkbox
                      checked={checked}
                      onChange={handleCheckbox}
                      sx={{
                        color: purple[200],
                        '&.Mui-checked': {
                          color: purple[200],
                        },
                        '&.Mui-disabled': {
                          color: purple[200],
                        },
                        '& .MuiSvgIcon-root': { fontSize: 28 }
                      }}
                      disabled={(obj.blogFile === null && true) || (notUploaded !== null && notUploaded)}
                    />} label="Upload" sx={{ color: 'white' }} />



                  </Stack>
                }
                {existingImage === "No" && <Stack direction='row' gap={3} sx={{ width: "97%", justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '100%' }}>

                    <input type="file" accept="image/png, image/jpeg, image/jpg" name="blogImage" id="blogImage" onChange={uploadFile} style={{ width: '100%' }} disabled={(checked && true) || (notUploaded !== null && notUploaded)} />
                  </div>

                  <FormControlLabel control={<Checkbox
                    checked={checked}
                    onChange={handleCheckbox}
                    sx={{
                      color: purple[200],
                      '&.Mui-checked': {
                        color: purple[200],
                      },
                      '&.Mui-disabled': {
                        color: purple[200],
                      },
                      '& .MuiSvgIcon-root': { fontSize: 28 }
                    }}
                    disabled={(obj.blogFile === null && true) || (notUploaded !== null && notUploaded)}
                  />} label="Upload" sx={{ color: 'white' }} />



                </Stack>}


              </Stack>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          {id ? <ContainedButton text="Update" event="onClick" functionName={createBlog} style={buttonStyle} disable={(existingImage === "No" && notUploaded !== null && notUploaded) || (disable&&true)} /> : <ContainedButton text="create" event="onClick" functionName={createBlog} style={buttonStyle} disable={(notUploaded !== null && notUploaded) || (disable && true)} />}
        </CardActions>
      </Card>

    </Box>
  )
}

export default AddBlog
