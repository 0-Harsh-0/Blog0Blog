import React from 'react'
import { purple } from '@mui/material/colors';
import Logo from "./Logo"

const Footer = () => {
  return (
      <footer style={{fontSize:'1.2rem',display:'flex',justifyContent:'center',alignItems:'center',background:purple[200],color:purple[800],padding:'.6rem',fontWeight:900}}>
      Copyright  &copy; &nbsp;  <Logo maxWidth="5rem"/>
      </footer>
     
  )
}

export default Footer