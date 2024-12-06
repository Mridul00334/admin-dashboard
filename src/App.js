import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Tree from "./components/tree";
import './App.css';
import { ThemeSettings } from './theme/Theme';
import SideDrawer from './shared/SideDrawer';

// import Board from "./components/Board"

function App() {
  const theme = ThemeSettings();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SideDrawer/>
      <div className="App">
    
     {/* <Board/> */}
      </div>
  </ThemeProvider>
  );
}

export default App; 