import React from 'react';
import logo from "../logo.png";

const Logo = ({maxWidth}) => {
  return (
  
          <img src={logo} alt="" style={{ maxWidth: `${maxWidth===null?'5.4rem':maxWidth}`,objectFit:'cover'}}/>
    
  )
}

export default Logo


Logo.defaultProps=
{
    maxWidth:null
}