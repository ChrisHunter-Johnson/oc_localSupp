import React, { Component, Fragment } from "react";
import { Button } from "primereact/button";
import Moment from "react-moment";
import { reRaise } from "../util/apiV1";
import { Growl } from "primereact/growl";
class UnmetRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postSuccessVisible: false,
      postErrVisible: false
    };
  }

  handleClick = e => {
    // call db to update
    let { need, summary } = this.props;
    need.raised_on = new Date();
    need.reraised = true;
    const data = {
      taskId: this.props.taskId
    };

    reRaise(data)
      .then(resp => {
        this.setState({ postSuccessVisible: true });
        this.growl.show({
          severity: "success",
          summary: "Re-raised need",
          detail: `Your ${summary} need has been re-raised`
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ postErrVisible: true });
        this.growl.show({
          severity: "error",
          summary: "Could not re-raised need",
          detail: "Could not re-raise your need"
        });
      });
  };

  render() {
    let { summary, startDate, taskId } = this.props;
    return (
      <Fragment>
        <Growl ref={el => (this.growl = el)} />
        <tr>
          <td>{summary}</td>
          <td>
            <Moment format="DD/MM/YYYY ">{startDate}</Moment>
          </td>
          <td>
            <Button
              id={taskId}
              label="Re-raise"
              className="p-button-rounded p-button-success"
              icon="pi pi-check"
              onClick={event => this.handleClick(event)}
            />
          </td>
        </tr>
      </Fragment>
    );
  }
}

export default UnmetRow;
