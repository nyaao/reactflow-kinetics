import { createTheme } from "@mui/material/styles";

export const myTheme=createTheme({
  palette:{
    mode:'light',
    primary: {
      main: '#A1D6E2',
      light: '#BCBABE',
      dark: '#1995AD'
    },
    secondary: {
      main: '#A486B00',
      light: '#A2C523',
      dark: '#2E4600'
    }
  },
  typography:{
    button:{
      textTransform:"none"
    },
    fontSize:12,
  },
  mixins:{
    toolbar:{
      minHeight:42,
      maxHeight:42
    }
  },
  components:{
    MuiPaper:{
      styleOverrides:{
        rounded:{borderRadius:20}
      }
    },
    MuiCssBaseline: {
      styleOverrides: `
      ::-webkit-scrollbar{
          width: 10px;
      },
      ::-webkit-scrollbar-thumb {
          background-color: #BCBABE;
          border-radius: 10px;
      },
      ::-webkit-scrollbar-track {
        margin-top: 10px;
        margin-bottom: 10px;
        background-color: #EEEEEE;
        border-radius: 10px;
     
      }
      `
    },
    MuiButton:{
      defaultProps:{
        variant:"contained",
      }
    },
    MuiIconButton:{
      defaultProps:{
        size:"small"
      }
    },
    MuiTextField:{
      defaultProps:{
        variant:"outlined",
        color:"primary",
        size:"small",
        margin:"dense"
      }
    },
    MuiCheckbox:{
      defaultProps:{
        color:"primary",
        size:"small"
      }
    },
    MuiRadio:{
      defaultProps:{
        color:"primary"
      }
    },
    MuiSwitch:{
      defaultProps:{
        color:"primary"
      }
    },
    MuiList:{
      defaultProps:{
        dense:true
      }
    },
    MuiTable:{
      defaultProps:{
        size:"small"
      }
    }

  }


})
