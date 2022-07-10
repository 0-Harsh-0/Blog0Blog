import React from 'react'
import Button from '@mui/material/Button';
import { purple } from '@mui/material/colors';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import { Link } from 'react-router-dom';

const theme = createTheme({
    components: {
        // Name of the component
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    color: purple[800],
                    borderColor:purple[800],
                    "&:hover":
                    {
                        backgroundColor:purple[400],
                        color:"white",
                        borderColor: purple[400],
                        transition:"all .8s linear"
                    }
                },
            },
        },
    },
});


const OutlinedButton = ({text,link,event,functionName,style,disable}) => {
  return (
      <ThemeProvider theme={theme}>
          {link ? <Button component={Link} to={link} variant="outlined" size="medium" style={style} >
              {text}
              </Button>:
              event === "onClick" ? <Button variant="outlined" size="medium" onClick={functionName} style={style} disabled={disable}>
                  {text}
              </Button> : <Button variant="outlined" size="medium" style={style} disabled={disable}>
                  {text}
              </Button>}
    </ThemeProvider>
  )
}

OutlinedButton.defaultProps = 
{
    link:null,
    event: null,
    functionName: null,
    style:null,
    disable:false
}

export default OutlinedButton