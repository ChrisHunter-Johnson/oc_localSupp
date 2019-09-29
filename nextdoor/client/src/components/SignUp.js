import React, { Component, Fragment } from "react";
//import ReactDOM from "react-dom";
import { Form } from "react-final-form";
import { Field } from "react-final-form-html5-validation";
import { Link, Redirect } from "react-router-dom";
import FormStyles from "../util/styles";
//import Axios from "axios";
import { signUp } from "../util/auth";
//import Header from "./Header";
//import FileReaderInput from "react-file-reader-input";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Growl } from "primereact/growl";

import "../css/default.css";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      idDocMediaType: " ",
      selectedFile: null,
      fileData: null,
      errorDlgvisible: false,
      savedDlgVisible: false
    };
    //this.fileReader;
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = values => {
    let currThis = this;
    let { email, password, confirmPassword, firstName, familyName } = values;
    if (password !== confirmPassword) {
      currThis.growl.show({
        severity: "error",
        summary: "Password mismatch",
        detail: "Password and confirm password must be the same"
      });
    }
    const data = {
      user: {
        email: email,
        password: password,
        password_confirmation: confirmPassword,
        first_name: firstName,
        last_name: familyName
        //gov_id_doc: currThis.state.fileData
      }
    };

    signUp(data)
      .then(function(response) {
        //let { email } = response;
        currThis.setState({
          redirect: true,
          user: response
        });
        currThis.setState({ savedDlgVisible: true });
        // alert("Account created");
      })
      .catch(function(error) {
        currThis.setState({ errorDlgvisible: true });
        //alert("could not create account", error);
      });
  };

  onHide = () => {
    if (this.state.errorDlgvisible) {
      this.setState({ errorDlgvisible: false });
    }
    if (this.state.savedDlgVisible) {
      this.setState({ savedDlgVisible: false });
    }
  };

  onClick() {
    this.setState({ errorDlgvisible: true });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/task_home" />;
      //<Redirect
      //  to={{
      //    pathname: "/task_home",
      //    state: { referrer: this.state.user }
      //  }}
      // />;
    }
  };
  validate = values => {
    const errors = {};

    if (!values.email) {
      errors.email = "You must supply your email";
    }

    return errors;
  };

  fileChangedHandler = event => {
    let currState = this;

    const file = event.target.files[0];
    this.setState({ selectedFile: file });
    var reader = new FileReader();

    reader.onload = function(e) {
      var urlData = reader.result;

      currState.setState({ fileData: urlData });
      currState.growl.show({
        severity: "success",
        summary: "Upload success",
        detail: `Government ID has been updated - file: ${file.name}`
      });
    };

    reader.readAsDataURL(file);
  };

  render() {
    const footer = (
      <div>
        <Button label="Okay" icon="pi pi-times" onClick={this.onHide} />
      </div>
    );

    return (
      <Fragment>
        <Growl ref={el => (this.growl = el)} />

        {this.renderRedirect()}
        <div className="signUpContainer">
          <div className="card">
            <div className="card-header login-card-header">
              Register with Your Neighbourhood
            </div>
            <div className="card-body">
              <h5 className="card-title login-title">Sign up</h5>
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
                          autoComplete="username"
                          required
                        />
                      </div>
                      <div>
                        <label>Password</label>
                        <Field
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          component="input"
                          placeholder="Password"
                          required
                          maxLength={128}
                          tooLong="Passeord is too long"
                          minLength={6}
                          tooShort="Passeord is too short"
                        />
                      </div>
                      <div>
                        <label>Repeat Password</label>
                        <Field
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          component="input"
                          placeholder="Re-enter Password"
                          required
                        />
                      </div>

                      <div>
                        <label>First Name</label>
                        <Field
                          name="firstName"
                          component="input"
                          type="text"
                          placeholder="First Name"
                          pattern="[A-Z].+"
                          patternMismatch="Capitalize your name!"
                          required
                          minLength={4}
                          tooShort="You need a longer name"
                          valueMissing="First name must be entered"
                        />
                      </div>
                      <div>
                        <label>Family Name</label>
                        <Field
                          name="familyName"
                          component="input"
                          type="text"
                          placeholder="Family Name"
                          pattern="[A-Z].+"
                          patternMismatch="Capitalize your name!"
                          required
                          minLength={4}
                          tooShort="You need a longer name"
                          valueMissing="First name must be entered"
                        />
                      </div>

                      <div className="buttons">
                        <button type="submit" disabled={submitting}>
                          Submit
                        </button>
                        <button type="button">
                          <Link to="/">Home</Link>
                        </button>
                      </div>
                    </form>
                  )}
                />
              </FormStyles>
            </div>
          </div>
        </div>
        <Dialog
          header="Create User Error"
          visible={this.state.errorDlgvisible}
          style={{ width: "50vw" }}
          footer={footer}
          onHide={this.onHide}
          maximizable
        >
          Could not create user email must be unique. Please correct your entry
        </Dialog>
        <Dialog
          header="User Create"
          visible={this.state.savedDlgVisible}
          style={{ width: "50vw" }}
          footer={footer}
          onHide={this.onHide}
          maximizable
        >
          Created user. Please return to home and log in with your new account
        </Dialog>
      </Fragment>
    );
  }
}

export default SignUp;
