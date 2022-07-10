import React from 'react'
import Button from '@mui/material/Button';
import { purple } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const theme = createTheme({
    components: {
        // Name of the component
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: {
                    backgroundColor: purple[800],
                    color: "white",
                    border: `1px solid ${purple[800]}`,
                    borderColor: purple[800],                 
                    "&:hover":
                    {
                        color: purple[800],
                        borderColor: purple[800],
                        border:`1px solid ${purple[800]}`,
                        backgroundColor:"transparent",
                        transition: "all .8s linear"
                    }
                },
            },
        },
    },
});


const ContainedButton = ({text,link,event,functionName,style,disable}) => {
  return (
      <ThemeProvider theme={theme}>
        {link?
          <Button component={Link} to={link} variant="contained" size="medium" style={style} disabled={disable}>
              {text}
              </Button> : event === "onClick" ? <Button variant="outlined" size="medium" onClick={functionName} style={style} disabled={disable}>
                  {text}
              </Button> : <Button variant="contained" size="medium" style={style} disabled={disable}>
                  {text}
              </Button>}
      </ThemeProvider>
  )
}

ContainedButton.defaultProps = {
    link:null,
    event:null,
    functionName:null,
    style:null,
    disable:false
}

export default ContainedButton
