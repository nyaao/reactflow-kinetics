import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { myTheme } from './content/myTheme';
import ContentMain from './content/ContentMain';


function App() {
  return (
    <div>
      <ThemeProvider theme={myTheme}>
        <CssBaseline/>
          <ContentMain/>
      </ThemeProvider>
    </div>
  );
}

export default App;
