import React, { Component } from "react";
import { Button } from "primereact/button";
import Moment from "react-moment";
import { conversationCreate } from "../util/apiV1";
class ResolvingRow extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = e => {
    let { resolving, userId } = this.props;
    this.props.convCreate(resolving);
    let data = {
      conversation: {
        title: resolving.summary,
        task_id: resolving.id
      },
      user_id: userId
    };

    conversationCreate(data)
      .then(function(res) {
        console.log("Create conversation", res);
      })
      .catch(function(err) {
        console.log("Error conversation", err);
      });
  };

  render() {
    console.log(this.props);
    let { summary, startDate, taskId, numConv } = this.props;
    if (!numConv) {
      numConv = 0;
    }
    console.log(numConv);
    return (
      <tr>
        <td>{summary}</td>
        <td>
          <Moment format="DD/MM/YYYY ">{startDate}</Moment>
        </td>
        <td>
          {numConv === 0 ? (
            <Button
              id={taskId}
              label="Send Chat request"
              className="p-button-rounded p-button-success"
              icon="pi pi-check"
              onClick={event => this.handleClick(event)}
            />
          ) : (
            "Conversation started"
          )}
        </td>
      </tr>
    );
  }
}

export default ResolvingRow;
