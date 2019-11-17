import React from 'react';
import { QBgetGroupChatHistory, QBsendMessage, QBupdateMembers, QBgetUser } from '@/QuickBlox';
import config from 'config';
import { authHeader } from '@/_helpers';
import { authenticationService } from '@/_services';

class ChatWindow extends React.Component {
    constructor(props) {
        super(props);
        this.curr_id = authenticationService.currentUserValue.uid;
        this.state = {
            messages: [],   // sender_id, message, created_at "2016-03-23T17:00:42Z"
            group_members: [],  // [{username, _id}]    
            group_name: '',
            isLoading: false
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
        };
        fetch(`${config.apiUrl}/api/project/${this.props.project_id}`, requestOptions)
            .then(response => { return response.json() })
            .then(json => {
                this.setState({ group_name: json.title, group_members: json.members });
            });

        QBgetGroupChatHistory(this.props.chat_id)
            .then(msgs => {
                let messages = this.state.messages;
                msgs.forEach(msg => {
                    messages.push({ sender_id: msg.sender_id, message: msg.message, created_at: msg.created_at });
                })
                this.setState({ messages: messages, isLoading: false });
            });

        // listener for group chat messages from other users
        QB.chat.onMessageListener = (user_id, msg) => {
            this.props.disableChange();
            const d = new Date().toISOString();
            const dateTime = d.split('.')[0];

            let messages = this.state.messages;
            messages.push({ sender_id: user_id, message: msg, created_at: dateTime });

            this.setState({
                messages: messages
            });
            this.props.undisableChange();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.chat_id !== prevProps.chat_id) {
            this.setState({ isLoading: true });
            QBgetGroupChatHistory(this.props.chat_id)
                .then(msgs => {
                    let messages = [];
                    msgs.forEach(msg => {
                        messages.push({ sender_id: msg.sender_id, message: msg.message, created_at: msg.created_at });
                    })
                    this.setState({ messages: messages, isLoading: false });
                });
        }
        const chat_msgs = document.getElementById('chat-msgs');
        chat_msgs.scrollTop = chat_msgs.scrollHeight;
    }

    addMessage(e) {
        this.props.disableChange();
        const d = new Date().toISOString();
        const dateTime = d.split('.')[0];

        const user_id = JSON.parse(localStorage.getItem('currentUser')).uid;
        const msg = document.getElementById('message');

        let messages = this.state.messages;
        messages.push({ sender_id: user_id, message: msg.value, created_at: dateTime });
        this.setState({
            messages: messages
        });

        QBsendMessage(this.props.chat_id, msg.value);

        msg.value = '';
        this.props.undisableChange();
    }

    onEnter(e) {
        if (e.key === 'Enter') {
            this.addMessage(e);
        }
    }

    getUsername(id) {
        return id;
    }

    cleanTime(dateTime) {
        const arr = dateTime.split('T');
        const date = arr[0];
        const time = arr[1].replace('Z', '');
        return date + " " + time;
    }

    addMembers(e) {
        const members = document.getElementsByClassName('member-option');
        let new_chat_members = [];
        Array.from(members).forEach((member, index) => {
            QBgetUser(member.id)
                .then(user => {
                    new_chat_members.push(100109113);
                    if (index === members.length - 1) {
                        QBupdateMembers(this.props.chat_id, new_chat_members, []);
                    }
                })
        })
    }

    render() {
        let key = 0;

        return (
            <div className="card border-0 shadow bg-transparent mx-5">
                {/* group name */}
                <div className="card-header text-muted bg-light pt-4 border-0">
                    <h3 className="d-flex justify-content-between border-bottom p-2 pb-4">
                        {this.state.group_name}
                        <button className="btn btn-primary btn-circle" data-toggle="modal" data-target="#exampleModalCenter"><i className="fas fa-plus"></i></button>
                    </h3>
                </div>

                {/* chat history */}
                <div className="card-body bg-light border-0 scroll mb-0 pb-0 pt-0 mt-0" id="chat-msgs">
                    {(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>)}
                    {!this.state.isLoading &&
                        this.state.messages.map(message => {
                            return (
                                <div key={key++} className="media px-2 py-1">
                                    <div className="media-body">
                                        <h6>{this.getUsername(message.sender_id)} <small className="text-muted"><i>{this.cleanTime(message.created_at)}</i></small></h6>
                                        <p> {message.message} </p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* message input */}
                <div className="card-footer bg-light border-0">
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                        <input type="text" id="message" className="form-control bg-dark rounded-pill p-4" style={{ "color": "white" }} placeholder="Enter message" onKeyPress={this.onEnter.bind(this)}></input>
                        <button className="btn bg-transparent border-0 pr-0" id="send-button" onClick={this.addMessage.bind(this)}><i className="fa fa-paper-plane fa-hover" style={{ 'fontSize': '20px' }}></i></button>
                    </div>
                </div>

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
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.addMembers.bind(this)}>Add</button>
                            </div>
                        </div>
                    </div>
                </div> {/* Create group modal end */}
            </div>
        );
    }

}

export { ChatWindow };