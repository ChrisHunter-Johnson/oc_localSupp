import React, { Component } from "react";
//import { Link, Redirect } from "react-router-dom";

export class ConversationBtnRow extends Component {
  handleClick = e => {
    let that = this;
    let { conversation } = that.props;
    console.log(conversation);
    console.log("handleMsgClicK called e is");
    console.log(e.target.id);

    this.props.currConv(conversation);
  };

  render() {
    console.log("conversation button render");
    console.log(this.props);
    let { conversation } = this.props;
    console.log(conversation);
    return (
      <tr>
        <td>
          <button
            id={conversation.id}
            type="button"
            className="btn btn-primary"
            onClick={event => this.handleClick(event)}
          >
            <span id={conversation.id} className="buttonText">
              {conversation.title}{" "}
            </span>
          </button>
        </td>
      </tr>
    );
  }
}
