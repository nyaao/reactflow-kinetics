import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { myTheme } from "./myTheme";
import AppMain from "./AppMain";

const PrototypeMain=()=>{
  return(
    <ThemeProvider theme={myTheme}>
      <CssBaseline/>
        <AppMain/>
    </ThemeProvider>


  )
}

export default PrototypeMain;
