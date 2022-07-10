import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import Logo from '../Logo';
import {Link, useNavigate, useLocation} from "react-router-dom";
import BlogContext from '../../context/blog/BlogContext';
import Logout from '@mui/icons-material/Logout';
import { logout } from '../../firebase';
import Signin from '../auth/Signin';
import MobNav from './MobNav';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../../utility/utility.css"
import Profile from './Profile';


const theme = createTheme({
    components: {
        // Name of the component
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: {
                    "&.menuActive":
                    {
                        backgroundColor: purple[400],
                        color: "white",
                        transition: "color .5s linear",
                        borderTop: "1px solid white",
                        borderLeft: "1px solid white",
                        borderRadius: ".4rem",
                    }
                },
            },
        },
    },
});

const Navbar = () => {
    const obj = useContext(BlogContext)
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;


    const pages = ['Home', 'Other Blogs', 'About us'];

    const urls = ['/',  `/otherblogs/${obj.otherBlogURL}`, '/about'];

    const [anchorElUser, setAnchorElUser] = React.useState(false);
    const open = Boolean(anchorElUser);

    const handleOpenUserMenu = () => {
        setAnchorElUser(true);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(false);
    };

    const logoutUser = ()=>
    {
        setAnchorElUser(false);
        logout();
        obj.setUserData(null);
        navigate("/");
        sessionStorage.removeItem("uid");
    }

    return (
        <AppBar position="static" sx={{ background: purple[200], maxHeight: "56px" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters id="navBar">
          
                    <Typography
                        variant="h5"
                        sx={{
                            mr: 3,
                            display: { xs: 'flex', md: 'flex' },
                        }}
                    >
                       <Logo/>
                    </Typography>
            
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <MobNav/>
                    </Box>
                  
                   
                    <Box id="navBarMenu" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'} }}>
                        <ThemeProvider theme={theme}>
                        {pages.map((page,index) => (
                            <Button
                                key={page}
                                sx={{ my: 2, color: purple[800], display: 'block', textDecoration: 'none'}}
                                className={path === urls[index] ? "menuActive":'menuNotActive'}
                                component={Link}
                                to={urls[index]}
                            >
                                {page}
                            </Button>
                        ))}
                        {obj.userData !== null && 
                        <>
                        <Button
                            key="Create"
                            sx={{ my: 2, color: purple[800], display: 'block', textDecoration: 'none' }}
                            className={path === "/create" ? "menuActive" : 'menuNotActive'}
                            component={Link}
                            to="/create"
                        >
                            Create
                        </Button>
                        <Button
                            key="Your Blogs"
                            sx={{ my: 2, color: purple[800], display: 'block', textDecoration: 'none' }}
                            className={path === `/yourblogs/${obj.otherBlogURL}` ?"menuActive":"menuNotActive"}
                            component={Link}
                                    to={`/yourblogs/${obj.otherBlogURL}`}
                        >
                            Your Blogs
                        </Button>
                        </>}
                        </ThemeProvider>
                    </Box>

                    <Box>
                        {obj.userData !== null ?
                            <div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Typography variant="button" display="block" sx={{ color: purple[800] }}>
                                            {obj.userData?.displayName}
                                        </Typography>
                                        <IconButton
                                            onClick={handleOpenUserMenu}
                                            size="small"
                                            aria-controls={open ? 'account-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            sx={{ margin: 0 }}
                                            id='profileImageCircle'
                                        >
                                            <Avatar sx={{ bgcolor: purple[800], width: 45, height: 45, postion: "relative", zIndex: 10 }}>
                                                <img style={{maxWidth:'100%',objectFit:'cover'}} src={obj.userData ? obj.userData.photoURL : ''} alt={obj.userData ? obj.userData.displayName : ''} />
                                            </Avatar>
                                        </IconButton>
                                <Menu
                                    anchorEl={document.getElementById('profileImageCircle')}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleCloseUserMenu}
                                   
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            borderLeft:"2px solid white",
                                            borderTop:"2px solid white",
                                            background:purple[200],
                                            color:purple[900],
                                            fontWeight:"bolder",
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                            },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: -10,
                                                right: 16,
                                                width: 2,
                                                height: 2,
                                                background:'transparent',
                                                borderLeft:" 10px solid transparent",
                                                borderRight: '10px solid transparent',
                                                borderBottom:" 8px solid white",
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                        <Profile funtionName={handleCloseUserMenu}/>
                                  
                                    <MenuItem onClick={logoutUser}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" sx={{ color: purple[900], }}/>
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                                    </div>
                      

                            </div>:<div>
                                <Stack direction="row" spacing={2}>
                                    <Signin/>
                                </Stack>
                               
                            </div>}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar