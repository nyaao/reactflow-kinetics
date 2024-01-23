import React from 'react';
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import AppMain from './contents/App/AppMain';
import { myTheme } from './contents/App/myTheme';

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <CssBaseline/>
        <AppMain/>
    </ThemeProvider>
  );
}

export default App;
