import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Calculator from './Components/Calculator/Calculator';
import './index.css';

ReactDOM.render(
  <MuiThemeProvider>
    <Calculator />
  </MuiThemeProvider>,
  document.getElementById('app')
);
