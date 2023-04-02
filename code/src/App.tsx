import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { myTheme } from './content/myTheme';
import { AppMain } from './content/AppMain';

function App() {
  return (
    <div>
      <ThemeProvider theme={myTheme}>
        <CssBaseline/>
          <AppMain/>
      </ThemeProvider>
    </div>
  );
}

export default App;
