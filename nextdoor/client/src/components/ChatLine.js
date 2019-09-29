import React, { Component, Fragment } from "react";
import moment from "moment";
import "../css/default.css";

export class ChatLine extends Component {
  render() {
    let { message, loggedInUser } = this.props;

    let currTime = moment(message.created_at).format("DD/MM/YY - h:mm:ss a");
    if (message.user_id === loggedInUser.id) {
      return (
        <Fragment>
          <div className="msg-bubble msg-left">
            <p>
              {message.content} -<span>{currTime}</span>
            </p>
          </div>
        </Fragment>
      );
    } else {
      return (
        <div className="msg-bubble msg-right">
          <p>
            {message.content} - <span>{currTime}</span>
          </p>
          <br />
        </div>
      );
    }
  }
}
