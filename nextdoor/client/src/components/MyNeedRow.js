import React, { Component, Fragment } from "react";
import { Button } from "primereact/button";
import Moment from "react-moment";
import { closeTask } from "../util/apiV1";
import { Growl } from "primereact/growl";

export class MyNeedRow extends Component {
  handleClick = e => {
    let { need } = this.props;
    let that = this;
    let data = {
      params: { id: need.id }
    };
    closeTask(data)
      .then(function(res) {
        that.props.updateNeed();
        that.growl.show({
          severity: "success",
          summary: "Closed need",
          detail: `Your  need has been closed`
        });
      })
      .catch(function(err) {
        console.log("close task catch block");
        console.log(err);
        that.growl.show({
          severity: "error",
          summary: "Ned not Closed ",
          detail: `Could not close your need `
        });
      });
  };

  render() {
    let { summary, startDate, taskId, raised_on } = this.props.need;
    return (
      <Fragment>
        <Growl ref={el => (this.growl = el)} />
        <tr>
          <td>{summary}</td>
          <td>
            <Moment format="DD/MM/YYYY ">{startDate}</Moment>
          </td>
          <td>
            <Moment format="DD/MM/YYYY ">{raised_on}</Moment>
          </td>
          <td>
            <Button
              id={taskId}
              label="Completed"
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
