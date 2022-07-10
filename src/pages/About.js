import React from 'react';
import { purple } from '@mui/material/colors';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Logo from '../components/Logo';

const About = () => {
 return (
    <div>
     <Typography variant="h5" component="div" sx={{ textAlign: "center", margin: "1rem", background: purple[700], padding: ".5rem", color: "white", borderRadius: ".3rem", borderTop: "1px solid white", borderLeft: "1px solid white" }}>
       About us
     </Typography>

     <Box
       sx={{
         display: 'flex',
        justifyContent:'center',alignItems:'center',
        height:'100%',
        margin:'1rem'
       }}
     >
       <Paper elevation={24} sx={{ width:'100%', height:'100%', display: 'flex', justifyContent: 'center', alignItems: 'center',padding:'3rem' }}>
        <Logo maxWidth="70%"/>
       </Paper>
     </Box>
    </div>
  )
}

export default About