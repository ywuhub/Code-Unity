import React from 'react';
import { QBgetGroupChatHistory } from '@/QuickBlox';

class ChatWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],   // sender_id, message, created_at "2016-03-23T17:00:42Z"
            isLoading: false
        };
    }

    componentDidMount() {
        // QBgetGroupChatHistory();

        // listener for group chat messages from other users
        QB.chat.onMessageListener = (user_id, msg) => {
            const d = new Date().toISOString();
            const dateTime = d.split('.')[0];
        
            let messages = this.state.messages;
            messages.push({ sender_id: user_id, message: msg, created_at: dateTime });

            this.setState({
                messages: messages
            });
        }
    }

    addMessage(e) {
        const d = new Date().toISOString();
        const dateTime = d.split('.')[0];

        const user_id = JSON.parse(localStorage.getItem('currentUser')).uid;
        const msg = document.getElementById('message');

        let messages = this.state.messages;
        messages.push({ sender_id: user_id, message: msg.value, created_at: dateTime });
        this.setState({
            messages: messages
        });

        msg.value = '';
    }

    onEnter(e) {
        if (e.key === 'Enter') {
            this.addMessage(e);
        }
    }

    getUsername(id) {
        // TODO
        return id;
    }

    cleanTime(dateTime) {
        const arr = dateTime.split('T');
        const date = arr[0];
        const time = arr[1].replace('Z', '');
        return date + " " + time;
    }

    render() {
        let key = 0;
        return (
            <div className="card border-0 shadow bg-transparent mx-5">
                {/* group name */}
                <div className="card-header text-muted bg-light pt-4 border-0">
                    <h3 className="border-bottom p-2 pb-4">Project Group Name</h3>
                </div>

                {/* chat history */}
                <div className="card-body bg-light border-0 scroll mb-0 pb-0 pt-0 mt-0">
                    {
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
            </div>
        );
    }

}

export { ChatWindow };