import React from "react";
//import ReactDOM from "react-dom";
import { Form } from "react-final-form";
import { Field } from "react-final-form-html5-validation";
import { Link, Redirect } from "react-router-dom";
import FormStyles from "../util/styles";
import { signIn } from "../util/auth";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../css/default.css";

//const required = value => (value ? undefined : "Required");

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      visible: false,
      logonDlgVisiable: false,
      loggedInUser: null
    };

    this.signIn = this.onClick.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    let that = this;
    if (that.props.location && that.props.location.pathname !== "/") {
      this.setState({ logonDlgVisiable: true });
    }
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  onHide = () => {
    if (this.state.visible) {
      this.setState({ visible: false });
    }

    if (this.state.logonDlgVisiable) {
      this.setState({ logonDlgVisiable: false });
    }
  };
  onClick() {
    this.setState({ visible: true });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.signinSubmit !== this.state.signinSubmit) {
      this.handleSignIn();
    }
  }

  handleSignIn = () => {
    let that = this;
    let { signinData } = that.state;
    const data = {
      user: {
        email: signinData.email,
        password: signinData.password
      }
    };

    signIn(data)
      .then(function(resp) {
        that.setState({
          loggedInUser: resp,
          userId: resp.id,
          logginOk: true,
          redirect: true
        });
        that.props.signedIn(resp);

        sessionStorage.setItem("userId", resp.id);
      })
      .catch(function(error) {
        console.log("Error from sign up:  " + error);
        that.setState({
          visible: true
        });
        //window.alert(
        //  "Your Email and password is an invalid combination.  Please Correct"
        //);
        that.setState({
          redirect: false
        });
      });
  };
  //onSubmit = async values => {
  onSubmit(values) {
    let that = this;
    that.setState({ signinSubmit: true, signinData: values });
    //   const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    //   await sleep(300);
  }

  renderRedirect = () => {
    let sessionUserId = sessionStorage.getItem("userId");
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/task_home",
            state: { referrer: sessionUserId }
          }}
        />
      );
    }
  };

  validate = values => {
    const errors = {};

    if (!values.email) {
      errors.email = "Required";
    }
    return errors;
  };
  render() {
    const footer = (
      <div>
        <Button label="Close" icon="pi pi-check" onClick={this.onHide} />
      </div>
    );
    return (
      <div>
        {this.renderRedirect()}
        <div className="d-flex flex-row justify-content-end">
          <div className="card">
            <div className="card-header login-card-header">
              Welcome to Your Neighbourhood
            </div>
            <div className="card-body">
              <h5 className="card-title login-title">Login</h5>

              <FormStyles>
                <Form
                  onSubmit={this.onSubmit}
                  render={({
                    handleSubmit,
                    reset,
                    submitting,
                    pristine,
                    values
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div>
                        <label>Email</label>
                        <Field
                          name="email"
                          type="email"
                          typeMismatch="That's not an email address"
                          component="input"
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div>
                        <label>Password</label>
                        <Field
                          name="password"
                          type="password"
                          component="input"
                          placeholder="Password"
                          autoComplete="Current_Password"
                          required
                        />
                      </div>
                      <div className="buttons">
                        <button type="submit" disabled={submitting}>
                          Login
                        </button>
                        <button type="button">
                          <Link to="/sign_up">Sign-up</Link>
                        </button>
                      </div>
                    </form>
                  )}
                />
              </FormStyles>
            </div>
          </div>
        </div>
        <div>
          <Dialog
            header="Not Logged in"
            visible={this.state.logonDlgVisiable}
            style={{ width: "50vw" }}
            //footer={footer}
            onHide={this.onHide}
            maximizable
          >
            You must login to use this site.Please login now
          </Dialog>
          <Dialog
            header="Login Error"
            visible={this.state.visible}
            style={{ width: "50vw" }}
            footer={footer}
            onHide={this.onHide}
            maximizable
          >
            Your Email and password is an invalid combination. Please Correct
          </Dialog>
        </div>
      </div>
    );
  }
}

export default Home;
