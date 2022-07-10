import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { purple } from '@mui/material/colors';
import ContainedButton from '../buttons/ContainedButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import twitter from "../../images/twitter.png";
import google from "../../images/google.png";
import facebook from "../../images/facebook.png";
import { Stack } from '@mui/material';
import { SignInWithGoogle,SignInWithFacebook,SignInWithTwitter } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import "../../utility/utility.css"

// List of Auth Providers Name and Image
const auths = [["Google",google],["Facebook",facebook],["Twitter",twitter]];

// Creating Theme of dialogbox
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
          color:"white",
          padding:"1rem",
          paddingTop:0,
          maxWidth:"45rem"
        },
      },
    },
  },
});



//Defining Function which returns a dialogbox
function SimpleDialog(props) {

  //destructuring the object
  const { onClose, selectedValue, open } = props;

  //initializing the useNavigation function
  const navigate = useNavigate();

  //defining the function which closes the dialog box
  const handleClose = () => {
    onClose(selectedValue);
  };


  //defining the function for sign in with google
  const googleSignin=()=>
  {
    //SignInWithGoogle is imported from firebase file
    const signin = SignInWithGoogle();
    signin.then(data => {
      if (data) {
        //redirecting to the home page
        navigate("/")
      }
    })
  }

  //defining the function for sign in with facebook
  const facebookSignin=()=>
  {
     //SignInWithFacebook is imported from firebase file
    const signin = SignInWithFacebook();
    signin.then(data => {
      if (data) {
        //redirecting to the home page
        navigate("/")
      }
    })
  }

  //defining the function for sign in with twitter
  const twitterSignin=()=>
  {
     //SignInWithTwitter is imported from firebase file
    const signin = SignInWithTwitter();
    signin.then(data => {
      if (data) {
        //redirecting to the home page
        navigate("/")
      }
    })
  }

  //useMediaQuery is imported from material ui
  //defining the media query for screen size 615px max
  const media615px = useMediaQuery('(max-width:615px)');

  //list of auth providers functions which are defined above
  const authProvidersList = [googleSignin,facebookSignin,twitterSignin]

  return (
    <ThemeProvider theme={theme}>
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{textAlign:"center",textTransform:"uppercase",letterSpacing:"2px"}}>Sign in</DialogTitle>
      <Stack direction={media615px?"column":"row"} gap={2} sx={{ pt: 0 }}>

        {/* map is higher order array iterating method */}
        {auths.map((auth,index) => (
          <ListItem key={auth+index} className='authButton' sx={{ width: "100%", background: purple[900], borderRadius: ".3rem", borderTop: "2px solid white", borderLeft: "2px solid white", padding: ".3rem 1rem", fontWeight: "bolder", cursor: "pointer" }} onClick={authProvidersList[index]}>
            <ListItemAvatar>
            
               <img src={auth[1]} alt={auth[0]} style={{maxWidth:"3rem",objectFit:"cover"}}/>
              
            </ListItemAvatar>
            <ListItemText primary={auth[0]} />
          </ListItem>
        ))}
      </Stack>
    </Dialog>
    </ThemeProvider>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

const Signin = () => {
  //defining the state
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <ContainedButton text="Sign in" event="onClick" functionName={handleClickOpen}/>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}



export default Signin