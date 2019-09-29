import React, { Component } from "react";
import "./App.css";
//import ListsContainer from "./components/ListsContainer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home.js";
import SignUp from "./components/SignUp";
import TaskHome from "./components/TaskHome";
import MyInfo from "./components/MyInfo";
import { ChatHome } from "./components/ChatHome";
import NotFound from "./NotFound";
import { isSignedIn, signOut, reloadUser } from "./util/auth";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faUser,
  faHome,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
library.add(fab, faUser, faHome, faSignOutAlt);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userId: 0,
      userLoggedIn: false,
      //currentUser: "Smith",
      redirect: false,
      page: ""
    };
    this.updateCurrentUser = this.updateCurrentUser.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.updateLoggedIn = this.updateLoggedIn.bind(this);
    this.updateCurrentPage = this.updateCurrentPage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRefreshUser = this.handleRefreshUser.bind(this);
  }

  handleLogout() {
    let that = this;

    signOut()
      .then(function(res) {
        that.setState({
          user: null,
          userId: 0,
          userLoggedIn: false
        });
        sessionStorage.clear();
      })
      .catch(function(err) {
        console.log("error on logout");
        console.log(err);
      });
  }

  updateCurrentPage = sPage => {
    //let { page } = this;
    this.setState({
      page: sPage
    });
  };

  ifSignedIn() {
    isSignedIn().then(res => {
      this.setState({ user: res.user });
    });
  }

  handleRefreshUser = id => {
    let that = this;
    let data = {
      params: { userId: id }
    };
    reloadUser(data)
      .then(function(res) {
        that.setState({
          user: res,
          userId: res.id,
          userLoggedIn: true
        });
        sessionStorage.setItem("userId", res.id);
      })
      .catch(function(err) {
        console.log("Reload user catch");
        console.log(err);
      });
  };

  componentDidMount() {
    this.ifSignedIn();
  }

  updateCurrentUser(oUser) {
    this.setState({
      user: oUser,
      userLoggedIn: true
    });
    sessionStorage.setItem("userId", oUser.id);
  }

  getCurrentUser() {
    return this.state.user;
  }

  updateLoggedIn(bLoggedIn) {
    this.setState({
      userLoggedIn: bLoggedIn
    });
  }
  render() {
    let { user } = this.state;
    if (!user) {
      let userId = sessionStorage.getItem("userId");
      this.handleRefreshUser(userId);
      user = this.state.user;
    }
    return (
      <div className="container-fluid app">
        <div className="app-content">
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Home
                    loggedInUser={user}
                    signedIn={this.updateCurrentUser}
                    getCurrentUser={this.getCurrentUser}
                  />
                )}
              />
              <Route
                exact
                path="/home"
                render={() => (
                  <Home
                    loggedInUser={user}
                    signedIn={this.updateCurrentUser}
                    getCurrentUser={this.getCurrentUser}
                  />
                )}
              />
              <Route
                exact
                path="/sign_up"
                render={() => (
                  <SignUp
                    loggedInUser={user}
                    signedIn={this.updateCurrentUser}
                  />
                )}
              />
              <Route
                exact
                path="/task_home"
                render={() => (
                  <TaskHome
                    loggedInUser={user}
                    signOut={this.handleLogout}
                    refreshUser={this.handleRefreshUser}
                    getLoggedIn={this.getCurrentUser}
                    getCurrentUser={this.getCurrentUser}
                  />
                )}
              />
              <Route
                exact
                path="/my_info"
                render={() => (
                  <MyInfo
                    loggedInUser={user}
                    refreshUser={this.handleRefreshUser}
                  />
                )}
              />
              <Route
                exact
                path="/conv_chat"
                render={() => (
                  <ChatHome
                    appProps={this.state}
                    loggedInUser={user}
                    refreshUser={this.handleRefreshUser}
                  />
                )}
              />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
