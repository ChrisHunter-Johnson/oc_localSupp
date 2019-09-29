import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";

import { TabView, TabPanel } from "primereact/tabview";
import {
  raisedCount,
  raisedOpen24Hr,
  needResolver,
  myOpenNeeds,
  myFullfilledNeeds
} from "../util/apiV1";
import { reloadUser } from "../util/auth";
import UnmetRow from "./UnmetRow";
import ResolvingRow from "./ResolvingRow";
import { MyNeedRow } from "./MyNeedRow";
//import { thisTypeAnnotation } from "@babel/types";
import "../css/default.css";
//import { faUserEdit } from "@fortawesome/free-solid-svg-icons";

class MyInfo extends Component {
  constructor(props) {
    super(props);
    let pageTitle = "No details found";

    let { loggedInUser } = props;

    let userId = loggedInUser ? loggedInUser.id : 0;
    if (loggedInUser) {
      let { first_name, last_name, id } = loggedInUser;
      pageTitle = `My Details - ${first_name} ${last_name}`;
      userId = id;
    }

    this.state = {
      title: pageTitle,
      userId: userId,
      raisedTasks: 0,
      fulfilledTasks: 0,
      raisedOpenOver24Hrs: [],
      resolving: [],
      redirect: false,
      myNeeds: []
    };
    this.handleMyNeedUpdate = this.handleMyNeedUpdate.bind(this);
    this.handleMyFullfilled = this.handleMyFullfilled.bind(this);
    this.handleConversationCreate = this.handleConversationCreate.bind(this);
  }

  loadUser = userId => {
    let that = this;
    let data = {
      params: { userId: userId }
    };
    reloadUser(data)
      .then(function(res) {
        let { firstName, lastName, id } = res;
        let pageTitle = `My Details - ${firstName} ${lastName}`;
        let userId = id;
        that.setState({ title: pageTitle, userId: userId });
        that.raisedTasks();
        that.raisedOpenOver4Hrs();
        that.needResolver();
        that.myOpenNeeds();
      })

      .catch(function(err) {
        console.log(err);
      });
  };

  componentDidMount() {
    if (!this.props.loggedInUser) {
      let sessionUserId = sessionStorage.getItem("userId");
      let redirect = sessionUserId > 0 ? false : true;
      if (sessionUserId > 0) {
        this.props.refreshUser(sessionUserId);
        this.loadUser(sessionUserId);
      }

      this.setState({ redirect: redirect });
    } else {
      this.setState({ redirect: false });
    }
    this.raisedTasks();
    this.raisedOpenOver4Hrs();
    this.needResolver();
    this.myOpenNeeds();
    this.myFullfilled();
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

  myFullfilled = () => {
    let { userId } = this.state;
    let data = {
      params: { userId: userId }
    };
    if (userId) {
      myFullfilledNeeds(data)
        .then(resp => {
          this.setState({ fulfilledTasks: resp });
        })
        .catch(err => {
          console.log("could not get number of fullfilled - error is: ");
          console.log(err);
        });
    }
  };

  handleMyFullfilled = () => {
    this.myFullfilled();
  };

  handleConversationCreate = task => {
    alert("handle convervation create " + task.id);
  };

  myOpenNeeds = () => {
    let { userId } = this.state;
    let data = {
      params: { userId: userId }
    };
    if (userId) {
      myOpenNeeds(data)
        .then(resp => {
          if (resp) {
            this.setState({ myNeeds: resp });
          } else {
            this.setState({ myNeeds: [] });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  handleMyNeedUpdate = () => {
    this.myOpenNeeds();
  };

  needResolver = () => {
    let { userId } = this.state;
    let data = {
      params: { userId: userId }
    };
    if (userId) {
      needResolver(data)
        .then(resp => {
          if (resp) {
            this.setState({ resolving: resp });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  raisedOpenOver4Hrs = () => {
    let { userId } = this.state;
    let data = {
      params: { userId: userId }
    };
    if (userId) {
      raisedOpen24Hr(data).then(resp => {
        if (resp) {
          this.setState({ raisedOpenOver24Hrs: resp });
        }
      });
    }
  };

  raisedTasks() {
    let that = this;
    let { userId } = this.state;

    let data = {
      params: { userId: userId }
    };
    if (userId) {
      raisedCount(data)
        .then(function(resp) {
          //let raisedCount = 0;

          that.setState(prevState => ({ raisedTasks: resp }));
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }

  render() {
    let {
      fulfilledTasks,
      title,
      raisedTasks,
      raisedOpenOver24Hrs,
      resolving,
      myNeeds,
      userId
    } = this.state;
    return (
      <Fragment>
        {this.renderRedirect()}
        <div className="card">
          <h5 className="card-header myDetails-card-header">{title}</h5>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-4 col-left">Needs fullfilled</div>
              <div className="col-lg-1 col-right">{fulfilledTasks}</div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-left">Needs requested</div>
              <div className="col-lg-1 col-right">{raisedTasks}</div>
            </div>

            <TabView>
              <TabPanel header="Unmet needs over 24 hours old">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Summary</th>
                      <th> required on </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raisedOpenOver24Hrs.map((need, i) => (
                      <UnmetRow
                        key={i}
                        summary={need.summary}
                        startDate={need.startDate}
                        taskId={need.id}
                        need={need}
                      />
                    ))}
                  </tbody>
                </table>
              </TabPanel>
              <TabPanel header="Needs I am resolving">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Summary</th>
                      <th> required on </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolving.map((res, i) => (
                      <ResolvingRow
                        key={i}
                        userId={userId}
                        summary={res.summary}
                        startDate={res.startDate}
                        taskId={res.id}
                        numConv={res.numConv}
                        resolving={res}
                        convCreate={this.handleConversationCreate}
                      />
                    ))}
                  </tbody>
                </table>
              </TabPanel>
              <TabPanel header="My Open Needs">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Summary</th>
                      <th>Required on</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myNeeds
                      ? myNeeds.map((need, i) => (
                          <MyNeedRow
                            key={i}
                            userId={userId}
                            need={need}
                            updateNeed={this.handleMyNeedUpdate}
                          />
                        ))
                      : null}
                  </tbody>
                </table>
              </TabPanel>
            </TabView>
            <div className="flex-centre">
              <button type="button" className="btn btn-success ">
                <Link to="/task_home" className="buttonText">
                  <span>Home</span>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default MyInfo;
