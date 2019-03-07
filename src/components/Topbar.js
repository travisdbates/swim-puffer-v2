import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import Menu from './Menu';
import Dashboard from './Dashboard';
import Auth from '../utils/auth';
const auth = new Auth();

const logo = require('../images/logo.svg');

const styles = theme => ({
  appBar: {
    position: 'fixed',
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.grey['100']}`,
    backgroundColor: 'white'
  },
  inline: {
    display: 'inline'
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    }
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productLogo: {
    display: 'inline-block',
    borderLeft: `1px solid ${theme.palette.grey['A100']}`,
    marginLeft: 32,
    paddingLeft: 24
  },
  tagline: {
    display: 'inline-block',
    marginLeft: 10
  },
  iconContainer: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  iconButton: {
    float: 'right'
  },
  tabContainer: {
    marginLeft: 32,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  tabItem: {
    paddingTop: 20,
    paddingBottom: 20,
    minWidth: 'auto'
  }
});

class Topbar extends Component {
  state = {
    value: 0,
    menuDrawer: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  mobileMenuOpen = event => {
    this.setState({ menuDrawer: true });
  };

  mobileMenuClose = event => {
    this.setState({ menuDrawer: false });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  current = () => {
    if (this.props.currentPath === '/home') {
      return 0;
    }
    if (this.props.currentPath === '/faq') {
      return 1;
    }
    if (this.props.currentPath === '/dash') {
      return 2;
    }
    if (this.props.currentPath === '/signup') {
      return 3;
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Toolbar>
          <Grid container spacing={24} alignItems="baseline">
            <Grid item xs={12} alignItems="baseline" className={classes.flex}>
              <div className={classes.inline}>
                <Typography variant="h6" color="inherit" noWrap>
                  <Link to="/" className={classes.link}>
                    <img width={50} src={logo} />
                    <span className={classes.tagline}>Pufferfish Swim</span>
                  </Link>
                </Typography>
              </div>
              {!this.props.noTabs && (
                <React.Fragment>
                  <div className={classes.productLogo}>
                    <Typography>Menu</Typography>
                  </div>
                  <div className={classes.iconContainer}>
                    <IconButton
                      onClick={this.mobileMenuOpen}
                      className={classes.iconButton}
                      color="inherit"
                      aria-label="Menu">
                      <MenuIcon />
                    </IconButton>
                  </div>
                  <div className={classes.tabContainer}>
                    <SwipeableDrawer
                      anchor="right"
                      open={this.state.menuDrawer}
                      onClose={this.mobileMenuClose}>
                      <List>
                        {Menu.map((item, index) => {
                          if (item.protected) {
                            if (!localStorage.getItem('isLoggedIn')) {
                              return null;
                            }
                          }
                          return (
                            <ListItem
                              component={Link}
                              to={{
                                pathname: item.pathname,
                                search: this.props.location.search
                              }}
                              button
                              key={item.index}>
                              <ListItemText primary={item.label} />
                            </ListItem>
                          );
                        })}

                        {localStorage.getItem('isLoggedIn') ? (
                          <ListItem
                            component={Link}
                            to=""
                            button
                            onClick={() => auth.logout()}>
                            <ListItemText
                              style={{ textTransform: 'none' }}
                              primary={'Logout'}
                            />
                          </ListItem>
                        ) : (
                          <ListItem
                            component={Link}
                            to=""
                            button
                            onClick={() => auth.login()}>
                            <ListItemText
                              style={{ textTransform: 'none' }}
                              primary={'Login/Signup'}
                            />
                          </ListItem>
                        )}

                        {/* {!localStorage.getItem('isLoggedIn') ? (
                          <span
                            onClick={() => auth.login()}
                            className="loginBtn"
                            activeClassName="loginBtnAct">
                            Login/Signup
                          </span>
                        ) : (
                          <span
                            onClick={() => auth.logout()}
                            className="loginBtn"
                            activeClassName="loginBtnAct">
                            Logout
                          </span>
                        )} */}
                      </List>
                    </SwipeableDrawer>
                    <Tabs
                      value={this.current() || this.state.value}
                      indicatorColor="primary"
                      textColor="primary"
                      onChange={this.handleChange}>
                      {Menu.map((item, index) => {
                        if (item.protected) {
                          if (!localStorage.getItem('isLoggedIn')) {
                            return null;
                          }
                        }
                        return (
                          <Tab
                            key={index}
                            component={Link}
                            to={{
                              pathname: item.pathname,
                              search: this.props.location.search
                            }}
                            classes={{ root: classes.tabItem }}
                            label={item.label}
                          />
                        );
                      })}
                      {localStorage.getItem('isLoggedIn') ? (
                        <Tab
                          component={Link}
                          to=""
                          classes={{ root: classes.tabItem }}
                          label={'Logout'}
                          onClick={() => auth.logout()}
                        />
                      ) : (
                        <Tab
                          component={Link}
                          to=""
                          classes={{ root: classes.tabItem }}
                          label={'Login/Signup'}
                          onClick={() => auth.login()}
                        />
                      )}
                    </Tabs>
                  </div>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(withStyles(styles)(Topbar));
