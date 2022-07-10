import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const Uploading = (props) => {
  return (
      <div style={{position: 'fixed',zIndex:100, left: 0, right: 0, top: '5.8rem', borderTop: '2px solid white', borderLeft: '2px solid white', borderRadius: '.4rem', width: '18rem', margin: '0 auto', padding: '.5rem', background: purple[100], textAlign: "center" }}>
          <Stack direction="row" gap={2} alignItems='center' justifyContent='center'>
              {props.uploaded ? <CheckCircleIcon fontSize='large' sx={{ color: green[600] }} /> : <CircularProgress sx={{ width: '30px', height: '30px', color: purple[800] }} />}
              <Typography variant='h6' color={purple[800]}>
                 {props.text === null? `Uploading... ${props.uploading}% Done.`:props.text}
              </Typography>
          </Stack>
      </div>
  )
}

export default Uploading

Uploading.defaultProps=
{
    uploading:null,
    text:null,
    uploaded:false
}

