/*global google*/
import React, { Component, Fragment } from "react";
import { Growl } from "primereact/growl";
import { Dialog } from "primereact/dialog";
import { Form } from "react-final-form";
import { Field } from "react-final-form-html5-validation";
import FormStyles from "../util/styles";
import Moment from "react-moment";

import {
  taskCreate,
  boundsTasks,
  resolverCount,
  assignResolver
} from "../util/apiV1";
//import { sqlDateFormat } from "../util/helpers";
//import Moment from "react-moment";

//import { render } from 'react-dom';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      assistVisible: false,
      lat: 0,
      lng: 0,
      taskSummary: "", // to block waiting on user input or create marker in onSubmit?
      tasksList: [],
      needMap: null,
      selectedTask: null
    };
    this.onScriptLoad = this.onScriptLoad.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onShow = this.onShow.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onHideAssist = this.onHideAssist.bind(this);
    this.onShowAssist = this.onShowAssist.bind(this);
  }

  onHideAssist() {
    let that = this;
    that.setState({
      assistVisible: false
    });
  }

  onShowAssist() {
    let that = this;
    that.setState({
      assistVisible: true
    });
  }

  handleAssistClick(e) {
    let that = this;

    const data = {
      params: { taskId: e.target.id, userId: that.props.userId }
    };

    assignResolver(data)
      .then(function(resp) {
        that.growl.show({
          life: 15000,
          severity: "success",
          summary: "Added as Resolver",
          detail:
            "You have been added as a resolver. Please use chat from your account agree resolution."
        });
        that.onHideAssist();
      })
      .catch(function(err) {
        let httpResp = err.response.status;
        if (httpResp === 304) {
          that.growl.show({
            life: 15000,
            severity: "warn",
            summary: "Already resolver",
            detail:
              "You are already a resolver for this need. Please assist with another need"
          });
          that.onHideAssist();
        } else {
          that.growl.show({
            life: 15000,
            severity: "erro",
            summary: "Could not add resolver ",
            detail:
              "An unexpected error occurred. Please call customer services if this persists"
          });
        }
      });
  }

  onHide() {
    let that = this;

    that.setState({ visible: false });
  }

  onShow() {
    let that = this;
    that.setState({ visible: true });
  }

  onSubmit(values) {
    let that = this;

    let { taskType, summary, descr, startDate } = values; // decontruct values
    let { lat, lng } = that.state;
    let { userId } = this.props;
    if (!userId) {
      userId = sessionStorage.getItem("userId");
    }
    const data = {
      task: {
        taskType: taskType,
        summary: summary,
        description: descr,
        startDate: startDate,
        status: "open",
        fullfilled: false,
        lat: lat,
        lng: lng
      },
      userId: userId //this.props.userId
    };
    taskCreate(data)
      .then(function(response) {
        that.setState({ taskSummary: summary });
        that.growl.show({
          life: 15000,
          severity: "success",
          summary: "Saved Need",
          detail: `Your need  has been saved`
        });
        that.props.newTask();
        that.onHide();
        //that.props.onMapLoad()
      })
      .catch(function(error) {
        console.log("save task error");
        console.log(error);
        that.growl.show({
          life: 15000,
          severity: "error",
          summary: "Save Task error",
          detail: "Could not save the task at this time. Please try again."
        });
      });
  }

  onloadDefaults(mapBounds) {
    let that = this;
    //let { mapBounds } = that.state;
    let neLat = mapBounds.getNorthEast().lat();
    let neLng = mapBounds.getNorthEast().lng();
    let swLat = mapBounds.getSouthWest().lat();
    let swLng = mapBounds.getSouthWest().lng();
    let latLngParams = {
      params: {
        lat_end: neLat,
        lat_start: swLat,
        lng_end: swLng,
        lng_start: neLng
      }
    };

    boundsTasks(latLngParams)
      .then(function(response) {
        let tasksList = response.task;
        that.setState({
          tasksList: tasksList //response.task
        });
      })
      .then(function() {
        that.onAddMarkersToMap();
      });
  }

  // is is called to actually add to the map
  onAddMarkersToMap() {
    let that = this;
    let { tasksList, needMap } = that.state;
    if (!needMap) {
      return;
    }
    let bounds = needMap.getBounds();

    const greenUrl = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; // material
    const yellowUrl = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"; //service

    //let infoWindow = new google.maps.InfoWindow();
    if (tasksList) {
      tasksList.forEach(task => {
        let iconUrl = "";
        let position = {
          lat: task.lat,
          lng: task.lng
        };

        if (task.taskType === "service") {
          iconUrl = yellowUrl;
        } else {
          iconUrl = greenUrl;
        }
        let marker = new google.maps.Marker({
          position: position,
          title: task.summary,
          icon: {
            url: iconUrl
          }
        });

        let contentString =
          "<div className='row'></div> " +
          "<div >" +
          task.summary +
          "s" +
          "</div> " +
          "<div >" +
          task.description +
          "</div> </div>";
        let infoWindow = new google.maps.InfoWindow({
          content: contentString //"Summary: " + task.summary + " Description " + task.description
        });

        marker.addListener("mouseover", function() {
          infoWindow.open(needMap, marker);
        });
        marker.addListener("mouseout", function() {
          infoWindow.close(needMap, marker);
        });

        marker.addListener("click", function() {
          that.setState({
            selectedTask: task
          });
          let data = {
            params: { id: task.id }
          };

          let numResovers = 0;
          resolverCount(data)
            .then(function(res) {
              numResovers = res;
              if (numResovers <= 5) {
                that.onShowAssist();
              } else {
                that.growl.show({
                  life: 15000,
                  severity: "error",
                  summary: "Number of resolvers",
                  detail:
                    "There are already 5 resolvers assisting with this request. Please choose another need."
                });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        });
        marker.setMap(needMap);

        bounds.extend(marker.position);
        needMap.fitBounds(bounds);
      });
    }
    //google.maps.event.trigger(needMap, 'resize');
  }

  onScriptLoad() {
    let that = this;
    console.log("Map onscript load " + that.props.id);
    const map = new window.google.maps.Map(
      document.getElementById(that.props.id),

      this.props.options
    );
    let mapBounds = null;
    google.maps.event.addListener(map, "bounds_changed", function() {
      mapBounds = map.getBounds();
      that.setState({
        needMap: map,
        mapBounds: mapBounds
      });

      that.onloadDefaults(mapBounds);
    });

    this.props.onMapLoad(map);
    google.maps.event.addListener(map, "click", function(e) {
      let colUrl = "http://maps.google.com/mapfiles/ms/icons/blue.png";
      that.setState({
        lat: e["latLng"].lat(),
        lng: e["latLng"].lng()
      });
      that.onShow();
      let marker = new google.maps.Marker({
        position: e["latLng"],
        title: "Your new event",
        icon: {
          url: colUrl
        }
      });
      marker.setMap(map);
      let markerPos = marker.getPosition();
      mapBounds.extend(markerPos);
      map.fitBounds(mapBounds);
      map.setZoom(12);

      let infoContent = "New event !!";
      let infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });

      marker.addListener("mouseover", function() {
        infoWindow.open(map, marker);
      });
      marker.addListener("mouseout", function() {
        infoWindow.close(map, marker);
      });
    });
  }

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement("script");
      s.type = "text/javascript";
      // s.src = 'https://maps.google.com/maps/api/js?key='+process.env.REACT_APP_GOOGLE_MAP_API_KEY;
      s.src =
        "https://maps.google.com/maps/api/js?key=AIzaSyA5O8hO639iU0j9c1YSCg4Ys0Qv9o18j9c";
      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
      s.addEventListener("load", e => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  }

  render() {
    let { selectedTask } = this.state;
    let assistHeader = "";
    if (selectedTask) {
      assistHeader = `Offer to assist with request - ${selectedTask.summary} `;
    }
    return (
      <Fragment>
        <Growl ref={el => (this.growl = el)} />
        <div
          className="map-div"
          style={{
            height: "90vh"
          }}
          id={this.props.id}
        />
        <Dialog
          header={assistHeader}
          visible={this.state.assistVisible}
          style={{ width: "50vw" }}
          onHide={this.onHideAssist}
          maximizable
          styleClass="login-card-header"
        >
          <div className="row">
            <div className="col-5 col-md-2">Summary</div>
            <div className="col-6 col-md-4">
              {selectedTask ? selectedTask.summary : ""}
            </div>
          </div>
          <div className="row">
            <div className="col-5 col-md-2">Detail</div>
            <div className="col-6 col-md-4">
              {selectedTask ? selectedTask.description : ""}
            </div>
          </div>
          <div className="row">
            <div className="col-7 col-md-2">On</div>
            <div className="col-6 col-md-4">
              {selectedTask ? (
                <Moment format="Do MMMM YYYY">{selectedTask.startDate}</Moment>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md12">
              <button
                id={selectedTask ? selectedTask.id : ""}
                type="button"
                className="btn btn-success"
                onClick={e => this.handleAssistClick(e)}
              >
                Offer Assistance
              </button>
            </div>
          </div>
        </Dialog>

        <Dialog
          header="Your New Need"
          visible={this.state.visible}
          style={{ width: "50vw" }}
          onHide={this.onHide}
          maximizable
          styleClass="login-card-header"
        >
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
                    <label>Need Type</label>
                    <Field
                      name="taskType"
                      component="select"
                      required
                      validate={value =>
                        value === " " ? "You must select a type" : undefined
                      }
                    >
                      <option />
                      <option value="service">Service</option>
                      <option value="material">Material</option>
                    </Field>
                  </div>
                  <div>
                    <label>Summary</label>
                    <Field
                      name="summary"
                      component="input"
                      type="text"
                      placeholder="Summary of your need"
                      required
                      valueMissing="Summary is required"
                    />
                  </div>
                  <div>
                    <label>Description</label>
                    <Field
                      name="descr"
                      component="textarea"
                      placeholder="Enter details of your need in up to 300 characters"
                      maxLength="300"
                      required
                      valueMissing="Description is required"
                    />
                  </div>
                  <div>
                    <label>Start</label>
                    <Field
                      name="startDate"
                      component="input"
                      type="date"
                      required
                      valueMissing="Start date is required"
                      placeholder="Enter details of your need"
                    />
                  </div>
                  <div className="buttons">
                    <button type="submit" disabled={submitting}>
                      Save
                    </button>
                  </div>
                </form>
              )}
            />
          </FormStyles>
        </Dialog>
      </Fragment>
    );
  }
}

export default Map;
