/*global google*/
import React, { Component, Fragment } from "react";
//import Header from "./Header";
import Map from "./Map";
//import { render } from "react-dom";
import { Link, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  openTasks,
  boundsTasks,
  userConversation,
  resolverCount,
  assignResolver
} from "../util/apiV1";
//import { TaskHomeChatTable } from "./TaskHomeRow";
//import { ConversationBtnRow } from "./ConversationBtnRow";
import { Growl } from "primereact/growl";
import { Dialog } from "primereact/dialog";
import Moment from "react-moment";

import "../css/default.css";

class TaskHome extends Component {
  constructor(props) {
    super(props);

    let lat = 0;
    let lng = 0;
    let { loggedInUser } = props;
    let userId = 0;
    if (!loggedInUser) {
      userId = sessionStorage.getItem("userId");
    }

    this.state = {
      tasksList: [],
      taskMap: null,
      numOpenTasks: 0,
      latitude: lat,
      longitude: lng,
      resolving: [],
      offered: [],
      messageTopics: [],
      conversations: [],
      redirect: false,
      loggedInUser: null,
      assistVisible: false,
      selectedTask: null,
      userId: userId
    };
    this.onUpdateNeeds = this.onUpdateNeeds.bind(this);
    this.onNeedsRender = this.onNeedsRender.bind(this);
    this.onUpdateResolving = this.onUpdateResolving.bind(this);
    this.incrementNumOpen = this.incrementNumOpen.bind(this);
    //this.loadConversations = this.loadConversations.bind(this);
    //this.handleMsgClicK = this.handleMsgClicK.bind(this);
  }

  onHideAssist = () => {
    let that = this;
    that.setState({
      assistVisible: false
    });
  };

  onShowAssist() {
    let that = this;
    that.setState({
      assistVisible: true
    });
  }

  handleAssistClick(e) {
    let that = this;

    const data = {
      params: { taskId: e.target.id, userId: that.state.userId }
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
        let httpResp = err;
        console.log(err);
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

  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/home",
            state: { referrrer: "TaskHome" }
          }}
        />
      ); //to="/home" />;
    }
  };

  incrementNumOpen = () => {
    this.setState(prevState => ({ numOpenTasks: prevState.numOpenTasks + 1 }));
    this.forceUpdate();
  };

  componentDidMount() {
    //let that = this;
    let user = this.props.getCurrentUser();
    let redirect = user ? false : true;
    this.setState({ redirect: redirect });

    /*if (!this.props.loggedInUser) {
      let redirect = sessionUserId > 0 ? false : true;
      if (sessionUserId > 0) {
        this.props.refreshUser(sessionUserId);
      }
      this.setState({ redirect: redirect });
    } else {
      this.setState({ redirect: false });
      this.loadConversations();
    } */
    this.onUpdateNeeds();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.numOpenTasks !== this.state.numOpenTasks) {
      this.onUpdateNeeds();
    }
  }

  loadConversations = () => {
    let that = this;

    let data = {
      params: {
        userId: this.props.loggedInUser.id
      }
    };
    userConversation(data)
      .then(function(res) {
        that.setState({ conversations: res.conversation });
      })
      .catch(function(err) {});
  };

  onUpdateNeeds() {
    let that = this;
    openTasks()
      .then(function(response) {
        that.setState({
          numOpenTasks: response.length,
          tasksList: response
        });
      })

      .catch(function(error) {
        console.log(error);
      });
  }

  onUpdateResolving() {}

  onBoundsNeedsGet(boundsLatLng) {
    let that = this;
    let neLat = boundsLatLng.getNorthEast().lat();
    let neLng = boundsLatLng.getNorthEast().lng();
    let swLat = boundsLatLng.getSouthWest().lat();
    let swLng = boundsLatLng.getSouthWest().lng();
    let paramsData = {
      params: {
        lat_end: neLat,
        lat_start: swLat,
        lng_end: neLng,
        lng_start: swLng
      }
    };
    boundsTasks(paramsData)
      .then(function(response) {
        that.setState({
          tasksList: response.task
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  onNeedsRender(map) {
    let that = this;
    this.setState({
      taskMap: map
    });

    let { tasksList } = this.state;
    const greenUrl = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; // material
    const yellowUrl = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"; //service

    //let infoWindow = new google.maps.InfoWindow();

    map.addListener("idle", function() {
      let bounds = map.getBounds();
      //if (bounds) {
      //    let latLngBnds = map.getBounds();
      //}

      let ne = bounds.getNorthEast();
      let sw = bounds.getSouthWest();
      let neLat = ne.lat();
      let neLng = ne.lng();
      let swLat = sw.lat();
      let swLng = sw.lng();

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
          tasksList = response;
          that.setState({
            tasksList: tasksList
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    });
    tasksList = that.state.tasksList;
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
      let infoWindow = new google.maps.InfoWindow({
        content: task.summary + " - " + task.description
      });

      marker.addListener("mouseover", function() {
        infoWindow.open(map, marker);
      });
      marker.addListener("mouseout", function() {
        infoWindow.close(map, marker);
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
      marker.setMap(map);

      let latLngBnds = map.getBounds();
      if (latLngBnds) {
        latLngBnds.extend(marker.position);
      }

      map.fitBounds(latLngBnds);
    });
  }

  render() {
    let { loggedInUser } = this.props;
    let {
      numOpenTasks //, conversations
    } = this.state;
    let { selectedTask } = this.state;
    let assistHeader = "";
    if (selectedTask) {
      assistHeader = `Offer to assist with request - ${selectedTask.summary} `;
    }
    return (
      <Fragment>
        {this.renderRedirect()}
        <Growl ref={el => (this.growl = el)} />
        <div className="row">
          <div className="col-10 ">
            <div className="card text-white bg-info text-center">
              <div className="cardBody ">
                <p>Number of outstanding requests: {numOpenTasks}</p>
              </div>
            </div>
          </div>
          <div className="col-1">
            <Link
              to={{
                pathname: "/my_info",
                state: { loggedInUser: loggedInUser }
              }}
            >
              <FontAwesomeIcon icon="user" />
            </Link>
            &nbsp;
            <Link to="/home">
              <FontAwesomeIcon icon="home" />
            </Link>
            &nbsp;
            <Link to="/home" onClick={this.props.signOut}>
              <FontAwesomeIcon icon="sign-out-alt" />
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-10">
            <Map
              id="myMap"
              options={{
                center: { lat: 51.368103299999994, lng: -0.2102839 },
                zoom: 12
              }}
              onMapLoad={map => {
                this.onNeedsRender(map);
              }}
              userId={loggedInUser ? loggedInUser.id : null}
              newTask={this.incrementNumOpen}
            />
          </div>
          <div className="mapSide">
            <button id="msg1" type="button" className="btn btn-primary">
              <Link
                to={{
                  pathname: "/conv_chat"
                }}
                className="buttonText"
              >
                Chat Home
              </Link>
            </button>
          </div>
        </div>
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
      </Fragment>
    );
  }
}

export default TaskHome;
