import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

const Spinner = () => {
  return (
      <Stack sx={{ color: "white" }} spacing={2} direction="row" justifyContent="center" alignItems="center" height="90vh">
          <CircularProgress color="inherit" />
      </Stack>
  )
}

export default Spinner