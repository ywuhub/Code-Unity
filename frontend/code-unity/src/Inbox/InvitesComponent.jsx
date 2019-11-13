import React from 'react';
import { inboxService } from '@/_services';

class InviteSentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sent: []
        }
    }

    componentDidMount() {
        inboxService.get_invites_sent()
            .then(json => {
                this.setState({ sent: json });
            })
            .catch(err => { console.log(err); })
    }

    removeInvitation(e) {
        let sent = this.state.sent;
        sent.splice(e.target.value, 1);
        inboxService.remove_invitation(e.target.id, e.target.name)
            .then(json => {
                if (json.status === "success") {
                    this.setState({ sent: sent });
                } else {
                    console.log(json.message);
                }
            })
            .catch(err => { console.log(err) });
    }

    render() {
        let key = 0;
        return (
            <div>
                {this.state.sent.map((invite, index) => {
                    return (
                        <div key={key++} className="d-flex media text-muted border-bottom border-top border-gray">
                            <div className="d-flex media-body align-items-center small justify-content-between my-3">
                                <div className="d-inline-flex">
                                    <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                                    <div className="flex-column">
                                        <div><strong className="text-gray-dark">To: {invite.user_name}</strong></div>
                                        <div><b>Group:</b> {invite.project_title}</div>
                                        <div><span className="badge badge-primary p-2 mt-2">Invite Sent</span></div>
                                    </div>
                                </div>
                                <div className="">
                                    <button className="btn btn-sm btn-outline-secondary mx-1" id={invite.project_id} name={invite.user_id} value={index} onClick={this.removeInvitation.bind(this)}>Cancel Invite</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }
}

class InviteReceivedComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            received: []
        }
    }

    componentDidMount() {
        inboxService.get_invites_received()
            .then(json => {
                this.setState({ received: json });
            })
            .catch(err => { console.log(err); });
    }

    acceptInvitation(e) {
        let received = this.state.received;
        received.splice(e.target.value, 1);
        inboxService.accept_join_invitation(e.target.id)
            .then(json => { 
                if (json.status === "success") {
                    this.setState({ received: received }); 
                } else {
                    console.log(json.message);
                }
            })
            .catch(err => { console.log(err); });
    }

    declineInvitation(e) {
        let received = this.state.received;
        received.splice(e.target.value, 1);
        inboxService.remove_invitation(e.target.id, e.target.name)
            .then(json => {
                if (json.status === "success") {
                    this.setState({ received: received });
                } else {
                    console.log(json.message);
                }
            })
            .catch(err => { console.log(err) });
    }

    render() {
        let key = 0;
        return (
            <div>
                {this.state.received.map((invite, index) => {
                    return (
                        <div key={key++} className="d-flex media text-muted border-bottom border-top border-gray">
                            <div className="d-flex media-body align-items-center small justify-content-between my-3">
                                <div className="d-inline-flex">
                                    <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                                    <div className="flex-column">
                                        <div><strong className="text-gray-dark">From: {invite.user_name}</strong></div>
                                        <div><b>Group:</b> {invite.project_title}</div>
                                        <div><span className="badge badge-info p-2 mt-2">Invite Received</span></div>
                                    </div>
                                </div>
                                <div className="">
                                    <button className="btn btn-sm btn-outline-secondary mx-1" id={invite.project_id} value={index} onClick={this.acceptInvitation.bind(this)}>Accept</button>
                                    <button className="btn btn-sm btn-outline-secondary mx-1" id={invite.project_id} name={invite.user_id} value={index} onClick={this.declineInvitation.bind(this)}>Decline</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }
}

export { InviteSentComponent, InviteReceivedComponent };