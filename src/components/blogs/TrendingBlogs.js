import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import BlogContext from '../../context/blog/BlogContext';
import { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import "../../utility/utility.css"


const TrendingBlogs = ({ blogs }) => {
    const obj = useContext(BlogContext);
    let categoryString = "";
    const [trendingBlogs_,setTrendingBlogs] = useState(null)
    const length = blogs.length;

    const media700px = useMediaQuery('(max-width:700px)');
    const media1080px = useMediaQuery('(max-width:1080px)');

    const mediaQuery = () => {
        if (media700px) {
            return 1
        }
        else if (media1080px) {
            return 2
        }
        else {
            return 3
        }
    }

    let itemCount = mediaQuery();

    //useEffect runs once when page render
    useEffect(()=>
    {
        const makeTrendingBlogsList = ()=>
        {
            //this function creates a list base on itemCount like this
            //[ [blog1,blog2,blog3] , [blog1,blog2,blog3] ]
        const List = [];
        let index = 0;
            while (index < length) {
                let count = 0;
                let tempList = [];
                for (let indx = 0; indx < length; indx++) {
                    if (count < itemCount) {
                        if (index === length) {
                            break
                        }
                        tempList.push(blogs[index]);
                        count += 1;
                        index += 1;
                    }
                    else {
                        break;
                    }
                }
                List.push(tempList);
            }
            setTrendingBlogs(List)
        }
        length !== 0 && makeTrendingBlogsList();
    },[blogs,length,itemCount])

    return (
        <>
            <Carousel
                autoPlay={true}
                animation="fade"
                duration={800}
                indicators={true}
                cycleNavigation={true}
                navButtonsAlwaysVisible={true}
                navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
                    style: {
                        backgroundColor: purple[400],
                        borderRadius:'20px',
                        borderTop:'1px solid white',
                        borderLeft:'1px solid white',
                        padding:'.1rem 1rem'
                    }
                }} 
                navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
                    style: {
                        top: 'unset',
                        bottom:'-47%',
                    }
                }} 
                navButtonsAlwaysInvisible={false}
                sx={{margin: "0 1.5rem"}}
                indicatorIconButtonProps={{
                    style: {
                        padding: '10px',    // 1
                        color: 'white'      // 3
                    }
                }}
                activeIndicatorIconButtonProps={{
                    style: {
                        color: purple[200] // 2
                    }
                }}
               >

                {trendingBlogs_?.map((item, index) => {
                    return (
                        <Stack direction="row" gap={2} key={index} justifyContent="center" sx={{height:"20rem",width:"100%"}}>
                            {item.map((element) => {
                                return(
                                    
                                    <Link className='trendingBlogCard' to={`/detail/${element.id}`} key={element.id} style={{ textDecoration: "none", width:"24rem",height:"20rem" }}>
                                            <Box sx={{width:"100%",height:"100%", background: purple[700], borderTop: "2px solid white", borderLeft: "2px solid white", pt: ".2rem", pb: ".2rem", borderRadius: "1rem" }} style={{ marginBottom: "1rem" }}>
                                                <header style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                    <Typography variant="overline" sx={{ background: purple[200], padding: ".8rem", color: purple[800], borderRadius: ".3rem", lineHeight: "0", fontWeight: "bolder" }}>
                                                        {element.category.map((category) => {
                                                            return categoryString + category + " ";
                                                        })}
                                                    </Typography>
                                                </header>
                                                
                                                <figure style={{ padding: '1rem', borderRadius: "7rem 0", background: purple[200], margin: ".8rem" }}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{ maxWidth: "100%",maxHeight:"12rem", objectFit: "cover", borderRadius: "6rem 0" }}
                                                        image={element.imageUrl}
                                                        alt={element.title}
                                                    />
                                                </figure>

                                            <CardHeader
                                                sx={{ color: "white",paddingTop:".1rem",paddingBottom:".1rem" }}
                                                avatar={
                                                    <Avatar sx={{ bgcolor: purple[300] }} aria-label="recipe">
                                                        <img style={{ maxWidth: '100%', objectFit: 'cover' }} src={element.authorPhotoURL} alt={element.author.toUpperCase()} />
                                                    </Avatar>
                                                }
                                                title={element.author.toUpperCase()}
                                                subheader={<Typography variant="caption" color="white">
                                                    {`Created on ${obj.FormatedDate(element.created)}`}
                                                </Typography>}
                                            />
                                            <h2 className='jumpText'>
                                                <span>{element.title}</span>
                                            </h2>
                                            </Box>

                                        </Link>
                                    )
                            })}
                        </Stack>)
                })}

            </Carousel>
        </>
    )
}

export default TrendingBlogs