import React from 'react';
import config from 'config';
import { authHeader } from '@/_helpers';
import { authenticationService, userService } from '@/_services';
import { QBgetGroupChatHistory, QBsendMessage, QBaddMembers, QBgetUser, QBgetUserData } from '@/QuickBlox';

class ChatWindow extends React.Component {
    constructor(props) {
        super(props);
        this.curr_id = authenticationService.currentUserValue.uid;
        this.state = {
            messages: [],   // sender_id, message, created_at "2016-03-23T17:00:42Z"
            group_members: [],  // [{username, _id}]
            ids_map: {},
            group_name: '',
            chat_room: '',
            isLoading: false,
            isJoining: false,
            kicked: false
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true, isJoining: true });
        this.props.disableChatChange();
        var qb_users = this.props.qb_user_ids;
        var setIdMap = (ids_map) => {
            this.setState({ ids_map: ids_map });
        }
        QB.data.list("User", { qb_id: { or: qb_users } }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                let ids_map = {}
                for (let user of result.items) {
                    ids_map[user.qb_id] = user.username;
                }
                setIdMap(ids_map);
            }
        });
        var curr_id = this.curr_id;
        var chat_id = this.props.chat_id;
        var setRoom = (room) => { this.setState({ chat_room: room }) }
        var setJoining = () => {
            this.props.enableChatChange();
            this.setState({ isJoining: false });
        }
        QB.createSession({ login: curr_id, password: curr_id }, function (err, result) {
            if (result) {
                QB.chat.connect({ userId: result.user_id, password: curr_id }, function (err, res) {
                    if (res) {
                        QB.chat.dialog.list({ type: 2, _id: chat_id }, function (err, dialogs) {
                            const dlg = dialogs.items[0];
                            setRoom(dlg.xmpp_room_jid);
                            QB.chat.muc.join(dlg.xmpp_room_jid, function () {
                                console.log("Joined dialog " + dlg._id + " xmpp " + dlg.xmpp_room_jid);
                                setJoining();
                            })
                        })
                    }
                })
            }
        });

        userService.getProjectDetail(this.props.project_id)
            .then(json => {
                this.setState({ group_name: json.title, group_members: json.members });
            });

        QBgetGroupChatHistory(this.props.chat_id)
            .then(msgs => {
                if (msgs.length === 0) this.setState({ isLoading: false });
                let messages = [];
                for (let i = 0; i < msgs.length; ++i) {
                    const msg = msgs[i];
                    // QBgetUserData(msg.sender_id)
                    //     .then(user => {
                    //         messages.push({ sender_id: user.username, message: msg.message, created_at: msg.created_at });
                    //         if (i == msgs.length - 1) this.setState({ messages: messages, isLoading: false });
                    //     });
                    messages.push({ sender_id: msg.sender_id, message: msg.message, created_at: msg.created_at });
                }
                this.setState({ messages: messages, isLoading: false });
            });

        // listener for group chat messages from all users
        QB.chat.onMessageListener = (user_id, msg) => {
            console.log("message sent/received");
            if (this.props.chat_id !== msg.dialog_id) return;

            const d = new Date().toISOString();
            const dateTime = d.split('.')[0];

            let messages = this.state.messages;
            messages.push({ sender_id: user_id, message: msg, created_at: dateTime });

            this.setState({ messages: messages });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.chat_id !== prevProps.chat_id) {
            this.setState({ kicked: false });
            this.props.disableChatChange();
            var qb_users = this.props.qb_user_ids;
            var setIdMap = (ids_map) => {
                this.setState({ ids_map: ids_map });
            }
            QB.data.list("User", { qb_id: { or: qb_users } }, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    let ids_map = {}
                    for (let i = 0; i < result.items.length; ++i) {
                        let user = result.items[i];
                        ids_map[user.qb_id] = user.username;
                        if (i == result.items.length - 1) setIdMap(ids_map);
                    }
                }
            });
            var curr_id = this.curr_id;
            var chat_id = this.props.chat_id;
            var setRoom = (room) => { this.setState({ chat_room: room }) }
            var setJoining = () => {
                this.setState({ isJoining: false });
                this.props.enableChatChange();
            }

            this.setState({ messages: [], isLoading: true, isJoining: true });

            // swap group chat 
            var setKicked = () => { this.setState({ kicked: true })}
            QB.createSession({ login: curr_id, password: curr_id }, function (err, result) {
                if (result) {
                    QB.chat.connect({ userId: result.user_id, password: curr_id }, function (err, res) {
                        if (res) {
                            QB.chat.dialog.list({ type: 2, _id: chat_id }, function (err, dialogs) {
                                if (dialogs.items.length === 0) {
                                    setKicked();
                                    return;
                                }
                                const dlg = dialogs.items[0];
                                setRoom(dlg.xmpp_room_jid);
                                QB.chat.muc.join(dlg.xmpp_room_jid, function () {
                                    console.log("Joined dialog " + dlg._id + " xmpp " + dlg.xmpp_room_jid);
                                    setJoining();
                                })
                            })
                        }
                    })
                }
            });

            userService.getProjectDetail(this.props.project_id)
                .then(json => {
                    this.setState({ group_name: json.title, group_members: json.members });
                });

            QBgetGroupChatHistory(this.props.chat_id)
                .then(msgs => {
                    if (msgs.length === 0) this.setState({ isLoading: false });
                    let messages = [];
                    for (let i = 0; i < msgs.length; ++i) {
                        const msg = msgs[i];
                        messages.push({ sender_id: msg.sender_id, message: msg.message, created_at: msg.created_at });
                    }
                    this.setState({ messages: messages, isLoading: false });
                });
        }

        if (!this.state.isLoading) {

            const chat_msgs = document.getElementById('chat-msgs');
            chat_msgs.scrollTop = chat_msgs.scrollHeight;
        }
    }

    componentWillUnmount() {
        QB.chat.disconnect();
    }

    addMessage(e) {
        const msg = document.getElementById('message');
        if (/^(\s+|)$/.test(msg.value)) return;
        var send = {
            type: 'groupchat',
            body: msg.value,
            extension: {
                save_to_history: 1,
            }
        };

        var dialogJid = QB.chat.helpers.getRoomJidFromDialogId(this.props.chat_id);
        QB.chat.send(dialogJid, send);

        msg.value = '';
    }

    onEnter(e) {
        if (e.key === 'Enter') {
            this.addMessage(e);
        }
    }

    cleanTime(dateTime) {
        const arr = dateTime.split('T');
        const date = arr[0];
        const time = arr[1].replace('Z', '');
        return date + " " + time;
    }

    getUsername(id) {
        return this.state.ids_map[id] || "[ex-member]";
    }

    addMembers(e) {
        const members = document.getElementsByClassName('member-option');
        let new_chat_members = [];
        Array.from(members).forEach((member, index) => {
            QBgetUser(member.id)
                .then(user => {
                    new_chat_members.push(user.id);
                    if (index === members.length - 1) {
                        QBaddMembers(this.props.chat_id, new_chat_members);
                        document.getElementById('close-modal').click();
                    }
                })
        })
    }

    render() {
        let key = 0;

        return (
            <div>
                {this.state.kicked && <Alert />}
                <div className="card border-0 shadow bg-transparent mx-auto my-auto" id="chat-window">
                    {/* group name */}
                    {(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto p-3 my-3"></div>)}

                    {!this.state.isLoading &&
                        <div>
                            <div className="card-header text-muted bg-light pt-4 border-0">
                                {this.state.isJoining && <div className="text-muted" style={{ "fontSize": "12px" }}><img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" /> Not Connected. Connecting ...</div>}
                                <h3 className="d-flex justify-content-between border-bottom p-2 pb-4">
                                    <div>{this.state.group_name} <span className="h6 ml-2" style={{ "color": (!this.state.isJoining && "rgb(51, 213, 112)") }}><i className="fas fa-circle ml-2" style={{ "position": "absolute", "marginTop": "10px" }}></i></span> </div>
                                    <button className="btn bg-transparent" style={{ "color": "rgb(0, 123, 255)" }} data-toggle="modal" data-target="#exampleModalCenter"><i className="fas fa-plus"></i></button>
                                </h3>
                            </div>

                            <div className="card-body bg-light border-0 scroll mb-0 pb-0 pt-0 mt-0" id="chat-msgs">
                                {
                                    this.state.messages.map(message => {
                                        let msg = message.message;
                                        if (msg.body) msg = msg.body
                                        return (
                                            <div key={key++} className="media px-2 py-1">
                                                <img src="https://api.adorable.io/avatars/200/avatar.png" className="img-fluid img-circle d-block rounded-circle" width="40px" height="40px" alt="avatar" />
                                                <div className="media-body ml-2">
                                                    <h6>{this.getUsername(message.sender_id)} <small className="text-muted"><i>{this.cleanTime(message.created_at)}</i></small></h6>
                                                    <p> {msg} </p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className="card-footer bg-light border-0">
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <input type="text" id="message" className="form-control bg-dark rounded-pill p-4" style={{ "color": "white" }} placeholder={(this.state.isJoining && "Please wait. Joining Chat.") || "Enter message"} onKeyPress={this.onEnter.bind(this)} disabled={this.state.isJoining}></input>
                                    <button className="btn bg-transparent border-0 pr-0" id="send-button" onClick={this.addMessage.bind(this)} disabled={this.state.isJoining}><i className="fa fa-paper-plane fa-hover" style={{ 'fontSize': '20px' }}></i></button>
                                </div>
                            </div>
                        </div>
                    }

                    {/* Create group modal */}
                    <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">Add Members to Chat</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {
                                        this.state.group_members.map(member => {
                                            if (member._id == this.curr_id) return <div key={member._id}></div>
                                            return (
                                                <div className="custom-control custom-checkbox" key={member._id}>
                                                    <input type="checkbox" className="custom-control-input member-option" id={member._id} />
                                                    <label className="custom-control-label" htmlFor={member._id}>{member.username}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" id="close-modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={this.addMembers.bind(this)}>Add</button>
                                </div>
                            </div>
                        </div>
                    </div> {/* Create group modal end */}
                </div>
            </div>

        );
    }

}

function refresh() {
    window.location.reload();
}

function Alert(props) {
    return (
        <div className="alert alert-danger alert-dismissible fade show">
            <button type="button" className="close" onClick={refresh} data-dismiss="alert">&times;</button>
            <strong>Danger!</strong> You have been kicked from this project! c:
        </div>
    )
}

export { ChatWindow };