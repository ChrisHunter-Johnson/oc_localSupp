import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  userConversation,
  convUsers,
  messageList,
  messageCreate,
  convMessages
} from "../util/apiV1";
import { reloadUser } from "../util/auth";
import { ConversationBtnRow } from "./ConversationBtnRow";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ChatLine } from "./ChatLine";
import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/default.css";
import { clearTimeout } from "timers";

export class ChatHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      loggedInUser: null,
      otherUser: null,
      conversations: [],
      loadIntervalId: null,
      msgIntervalId: null,
      currentConv: null,
      currentTask: null,
      chatVisible: false,
      currentChatMessage: "",
      chatLogs: []
    };
    this.handleConversationClick = this.handleConversationClick.bind(this);
  }

  componentDidMount() {
    let that = this;
    let userId = 0;
    that.setState({ loggedInUser: this.props.loggedInUser });
    if (!this.props.loggedInUser) {
      userId = sessionStorage.getItem("userId");
      this.setState({ loggedInUserId: userId });
    } else {
      userId = this.props.loggedInUser.id;
    }
    let data = {
      params: { userId: userId }
    };

    reloadUser(data).then(function(res) {
      that.setState({ loggedInUser: res });
      that.loadConversations(res);
      that.loadMessages();
    });

    // that.loadConversations();
    // that.loadMessages();
    // console.log(this.state);
  }

  componentWillUnmount() {
    let that = this;
    window.clearTimeout(that.state.loadIntervalId);
    window.clearTimeout(that.state.msgIntervalId);
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/home",
            state: { referrrer: "ChatHome" }
          }}
        />
      ); //to="/home" />;
    }
  };

  handleConversationClick(conv) {
    let that = this;
    let data = {
      params: { convId: conv.id }
    };
    convUsers(data)
      .then(function(res) {
        let otherUser = null;
        let ownUserId = that.state.loggedInUserId;
        if (res[0].id !== ownUserId) {
          otherUser = res[1];
        } else {
          otherUser = res[0];
        }
        that.setState({
          currentConv: conv,
          otherUser: otherUser,
          chatVisible: true
        });
        that.loadMessages();
      })
      .catch(function(err) {
        console.log("convUsers error");
        console.log(err);
      });
    messageList(data)
      .then(function(res) {})
      .catch(function(err) {
        console.log("Mewssage list catch");
        console.log(err);
      });
  }

  loadConversations = usr => {
    let that = this;
    let { loggedInUser } = this.state;

    let data = {
      params: {
        userId: loggedInUser ? loggedInUser.id : 0
      }
    };
    userConversation(data)
      .then(function(res) {
        that.setState({ conversations: res });
        that.setState({
          loadIntervalId: setTimeout(that.loadConversations.bind(that), 1000)
        });
      })
      .catch(function(err) {
        console.log("Error loading conversations");
        console.log(err);
      });
  };

  loadMessages = () => {
    let that = this;
    if (!that.state.currentConv) {
      return;
    }

    let data = {
      params: { convId: that.state.currentConv ? that.state.currentConv.id : 0 }
    };

    convMessages(data)
      .then(function(res) {
        that.setState({ chatLogs: res });

        that.setState({
          msgIntervalId: setTimeout(that.loadMessages.bind(that), 30000)
        });
      })
      .catch(function(err) {
        console.log("loadMessages catch ");
        console.log(err);
      });
  };

  onHide = () => {
    if (this.state.chatVisible) {
      this.setState({ chatVisible: false });
      clearTimeout(this.state.msgIntervalId);
    }
  };
  handleSendEvent(event) {
    event.preventDefault();
    //this.chats.create(this.state.currentChatMessage);
    this.createMessage();
    this.setState({
      currentChatMessage: ""
    });
  }

  createMessage = () => {
    let that = this;
    let { currentChatMessage, chatLogs, currentConv } = that.state;
    let { loggedInUser } = this.state;
    let currTime = moment(new Date()).format("h:mm:ss a");
    if (!chatLogs) {
      chatLogs = [];
      that.setState({ chatLogs: [] });
    }
    let newMessage = {
      content: currentChatMessage,
      user_id: loggedInUser.id,
      conversation_id: currentConv.id,
      created_at: currTime
    };
    chatLogs.push(newMessage);
    let data = {
      message: {
        content: currentChatMessage
      },
      params: {
        userId: loggedInUser.id,
        convId: currentConv.id
      }
    };
    messageCreate(data)
      .then(function(res) {
        that.loadMessages();
      })
      .catch(function(err) {
        console.log("create message catch");
        console.log(err);
      });
  };

  renderChatLog = () => {
    let { loggedInUser, chatLogs } = this.state;
    return chatLogs
      ? chatLogs.map((msg, i) => {
          return <ChatLine id={i} message={msg} loggedInUser={loggedInUser} />;
        })
      : null;
  };

  handleChatInputKeyPress(event) {
    if (event.key === "Enter") {
      this.handleSendEvent(event);
    } //end if
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  render() {
    let { conversations, currentConv, otherUser, loggedInUser } = this.state;
    let header = `${currentConv ? currentConv.title : ""} need chat`;
    let ownName = `${loggedInUser ? loggedInUser.first_name : ""} ${
      loggedInUser ? loggedInUser.last_name : ""
    }`;
    let otherName = `${otherUser ? otherUser.first_name : ""} ${
      otherUser ? otherUser.last_name : ""
    }`;
    const footer = (
      <div>
        <Button label="Close" icon="pi pi-times" onClick={this.onHide} />
      </div>
    );
    return (
      <Fragment>
        {this.renderRedirect()}
        <div className="row">
          <div className="col-11 ">
            <div className="card text-white bg-info text-center">
              <div className="cardBody ">
                <p>Chat home</p>
              </div>
            </div>
          </div>
          <div className="col-1">
            <Link to="/task_home">
              <FontAwesomeIcon icon="home" />
            </Link>
          </div>
        </div>
        <div className="row">
          <section className="col-2">
            <table className="table table-striped table-dark">
              <thead>
                <tr>
                  <td className="chatHome-header">Chat conversations</td>
                </tr>
              </thead>
              <tbody>
                {conversations
                  ? conversations.map((conv, i) => (
                      <ConversationBtnRow
                        key={i}
                        loggedInUser={loggedInUser}
                        conversation={conv}
                        currConv={this.handleConversationClick}
                      />
                    ))
                  : null}
              </tbody>
            </table>
          </section>
          <section className="col-8">
            <Dialog
              header={header}
              visible={this.state.chatVisible}
              style={{ width: "50vw" }}
              footer={footer}
              onHide={this.onHide}
              maximizable
            >
              <div className="msg-wrap">
                <div className="msg-header-container">
                  <div className="msg-header msg-header-left">
                    <span>{ownName} </span>
                  </div>
                  <div className="msg-header msg-header-right">
                    <span>{otherName}</span>
                  </div>
                </div>
                <div className="msg-container">
                  <div className="msg-bubble msg-left">
                    {this.renderChatLog()}
                  </div>
                </div>
                <div id="inputWindow" className="msg-form">
                  <input
                    id="newMsgInput"
                    onKeyPress={e => this.handleChatInputKeyPress(e)}
                    value={this.state.currentChatMessage}
                    type="text"
                    onChange={e => this.updateCurrentChatMessage(e)}
                    placeholder="Enter your message..."
                  />

                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={e => this.handleSendEvent(e)}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Press Return or click the button"
                  >
                    Send
                  </button>
                </div>
              </div>
            </Dialog>
          </section>
        </div>
      </Fragment>
    );
  }
}
