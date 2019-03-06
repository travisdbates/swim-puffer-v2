import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import Routes from './routes';
import { ApolloProvider } from 'react-apollo';
import client from './utils/apollo-client';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#54B3B0'
    },
    primary: {
      main: '#2C6564'
    }
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    // fontFamily: ['"Lato"', 'sans-serif'].join(',')
  }
});

console.log(process.env.NODE_ENV);

class App extends Component {
  render() {
    return (
      <div>
        <ApolloProvider client={client}>
          <MuiThemeProvider theme={theme}>
            <Routes />
          </MuiThemeProvider>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
