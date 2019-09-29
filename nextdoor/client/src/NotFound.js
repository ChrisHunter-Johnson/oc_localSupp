import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
class NotFound extends Component {
  render() {
    return (
      <div className="signUpContainer">
        <div className="card">
          <div className="card-header login-card-header">
            <h1> 404: Could not find the page requested</h1>
          </div>
          <div className="card-body">
            <p>The page selected was invalid. PLease correct your entry.</p>
            <Button as={Link} to="/">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;
