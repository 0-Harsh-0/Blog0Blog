import React,{useContext} from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';
import CreateIcon from '@mui/icons-material/Create';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { purple } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link,useLocation } from 'react-router-dom';
import BlogContext from '../../context/blog/BlogContext';
import "../../utility/utility.css"

const drawerWidth = 240;

const theme = createTheme({
    components: {
        // Name of the component
        MuiDrawer: {
            styleOverrides: {
                // Name of the slot
                root: {
                    top:"56px"
                },
                paperAnchorLeft:
                {
                    top:"56px",
                    maxWidth:"210px",
                    padding: "1rem",
                    background:purple[200],
                },
            },
        },
   
        MuiBackdrop: {
            styleOverrides: {
                // Name of the slot
                root: {
                    top:"56px",
                },
            },
        },
   
    }
});

const theme2 = createTheme({
    components: {
        // Name of the component
        MuiListItem: {
            styleOverrides: {
                // Name of the slot
                root: {
                    color:"white",
                    "&.menuActive":
                    {
                        backgroundColor: purple[400],
                        transition: "color .8s linear",
                        borderTop: "1px solid white",
                        borderLeft: "1px solid white",
                        borderRadius: ".4rem",
                    }
                },
            },
        },
        MuiListItemIcon:
        {
            styleOverrides:
            {
                root:
                {
                    color:"white",
                    minWidth:"0",
                    marginRight:".5rem"
                }
            }
        },
        MuiListItemButton:
        {
            styleOverrides:
            {
                root:
                {
                    paddingLeft:".6rem",
                    paddingRight:".6rem",
                }
            }
        }
    },
});

//This is a Hamburger
const MobNav = () => {
    const obj = useContext(BlogContext)
    const location = useLocation();
    const path = location.pathname;

    const pages = ['Home', 'Other Blogs', 'About us'];

    const urls = ['/', `/otherblogs/${obj.otherBlogURL}`, '/about'];
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const icons = [<HomeIcon/>,<ArticleIcon/>,<InfoIcon/>]
    const drawer = (
        <div>
           
            <List padding="1rem">
                <ThemeProvider theme={theme2}>
                {pages.map((text, index) => (
                    <ListItem key={text} disablePadding className={path === urls[index] ? "menuActive" : 'menuNotActive'}
                        component={Link}
                        to={urls[index]}>
                        <ListItemButton>
                            <ListItemIcon>
                                {icons[index]}
                            </ListItemIcon>
                            <ListItemText primary={text.toUpperCase()} />
                        </ListItemButton>
                    </ListItem>
                ))}
                    {obj.userData !== null &&
                        <>
                            <ListItem disablePadding className={path === "/create" ? "menuActive" : 'menuNotActive'}
                                component={Link}
                                to="/create">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <CreateIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"create".toUpperCase()} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding className={path === `/yourblogs/${obj.otherBlogURL}` ? "menuActive" : "menuNotActive"}
                                component={Link}
                                to={`/yourblogs/${obj.otherBlogURL}`}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {icons[1]}
                                    </ListItemIcon>
                                    <ListItemText primary={"Your Blogs".toUpperCase()} />
                                </ListItemButton>
                            </ListItem>
                                </>}
                    </ThemeProvider>
            </List>
        </div>
    );


    return (
        <>
        <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        aria-label="open drawer"
                    >
                        <MenuIcon />
                    </IconButton>
            <Box
                component="nav"
                aria-label="mailbox folders"
            >
        <ThemeProvider theme={theme}>
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'block',md:'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
        </ThemeProvider>
            </Box>
        </>
    );
}


export default MobNav