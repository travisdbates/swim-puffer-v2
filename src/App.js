import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import Routes from './routes';
import { ApolloProvider } from 'react-apollo';
import client from './utils/apollo-client';
import * as Sentry from '@sentry/browser';

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

//dashboard?

class App extends Component {
  componentDidMount() {
    Sentry.init({
      dsn: 'https://1c58da41d341482c8c60e6cac825868c@sentry.io/1408857'
    });
  }

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
