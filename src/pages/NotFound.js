import React from 'react'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import OutlinedButton from '../components/buttons/OutlinedButton';

const NotFound = () => {
  const styledButton = { borderColor: "white", color: "white" }

  return (

    <Stack spacing={4} justifyContent="center" alignItems="center" sx={{ width: "100%",height:"80vh" }}>
      <div style={{textAlign:"center"}}>

      <Typography variant="h1" display="inline" textAlign="center" sx={{
        backgroundColor: purple[700],
        color: "white",
        transition: "color .8s linear",
        borderTop: "2px solid white",
        borderLeft: "2px solid white",
        borderRadius: ".4rem",
        padding: "1rem 2rem",
        letterSpacing:"3px",
      }}>404</Typography>
      </div>

      <Typography variant="h4" display="block" color="white" textAlign="center">
        OOPS! Page Not Found
      </Typography>

      <OutlinedButton text="Back To Home" link="/" style={styledButton} />
  
    </Stack>
  )
}

export default NotFound