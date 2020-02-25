import React, { Component } from "react";
import logo from "../../assets/PufferSwimLogo1.svg";
import { NavLink } from "react-router-dom";
import "./Nav.css";
import { slide as Menu } from "react-burger-menu";
import Auth from "../../utils/auth";

const auth = new Auth();

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null
    };
    console.log(this.state.userData);
  }

  adminButton = () => {
    if (this.state.userData !== null) {
      if (
        this.state.userData.email === "travbates93@gmail.com" ||
        this.state.userData.email === "mikel.north@gmail.com"
      ) {
        return (
          <NavLink
            className="loginBtn"
            to="/admin"
            activeClassName="loginBtnAct"
          >
            Admin
          </NavLink>
        );
      } else if (this.state.userData.email === "celestewardrop@gmail.com") {
        return (
          <NavLink
            className="loginBtn"
            to="/admin"
            activeClassName="loginBtnAct"
          >
            Admin
          </NavLink>
        );
      } else if (this.state.userData.email === "mccormickrt@gmail.com") {
        return (
          <NavLink
            className="loginBtn"
            to="/admin"
            activeClassName="loginBtnAct"
          >
            Admin
          </NavLink>
        );
      }
    }
  };

  render() {
    console.log(this.state.userData);
    return (
      <header>
        <NavLink to="/">
          <img className="title" src={logo} alt="Pufferfish Swim Lessons" />
        </NavLink>
        <div className="menuRegular">
          <NavLink
            className="loginBtn"
            activeClassName="loginBtnAct"
            exact
            to="/"
          >
            Home
          </NavLink>

          <div>
            <NavLink
              to="/faq"
              className="loginBtn"
              activeClassName="loginBtnAct"
            >
              FAQ
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/faq"
              className="loginBtn"
              activeClassName="loginBtnAct"
            >
              FAQ
            </NavLink>
          </div>

          {!localStorage.getItem("isLoggedIn") ? null : (
            <div>
              <NavLink
                to="/dash"
                className="loginBtn"
                activeClassName="loginBtnAct"
              >
                Dashboard
              </NavLink>
            </div>
          )}
          <div>{this.adminButton()}</div>
          {!localStorage.getItem("isLoggedIn") ? (
            <span
              onClick={() => auth.login()}
              className="loginBtn"
              activeClassName="loginBtnAct"
            >
              Login/Signup
            </span>
          ) : (
            <span
              onClick={() => auth.logout()}
              className="loginBtn"
              activeClassName="loginBtnAct"
            >
              Logout
            </span>
          )}
        </div>
      </header>
    );
  }
}
