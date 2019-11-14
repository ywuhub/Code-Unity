import React from 'react';
import { inboxService } from '@/_services';

class JoinRequestsSent extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            sent: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.isMounted_ = true;
        this.setState({ isLoading: true });
        inboxService.get_join_requests_sent()
            .then(json => {
                if (this.isMounted_) this.setState({ sent: json, isLoading: false });
            })
            .catch(err => { console.log(err); })
    }

    removeJoinRequestSent(e) {
        let sent = this.state.sent;
        sent.splice(e.target.value, 1);
        inboxService.remove_join_request_sent(e.target.id)
            .then(json => {
                if (json.status === "success") {
                    if (this.isMounted_) this.setState({ sent: sent });
                }
            })
            .catch(err => { console.log(err) });
    }

    render() {
        let key = 0;
        return (
            <div>
                {(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto p-3"></div>) ||
                    this.state.sent.map((invite, index) => {
                        return (
                            <div key={key++} className="d-flex media text-muted border-bottom border-top border-gray">
                                <div className="d-flex media-body align-items-center small justify-content-between my-3">
                                    <div className="d-inline-flex">
                                        <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                                        <div className="flex-column">
                                            <div><b>Group:</b> <Link to={{ pathname: "/group-" + invite.project_id, state: { _id: invite.project_id } }} style={{ 'textDecoration': 'none' }}> {invite.project_title} </Link></div>
                                            <div><i>{invite.message}</i></div>
                                            <div><span className="badge badge-primary p-2 mt-2">Join Request Sent</span></div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <button className="btn btn-sm btn-outline-secondary mx-1" id={invite.project_id} value={index} onClick={this.removeJoinRequestSent.bind(this)}>Cancel Request</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        )
    }
}

class JoinRequestsReceived extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            received: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.isMounted_ = true;
        this.setState({ isLoading: true });
        inboxService.get_join_requests_received()
            .then(json => {
                if (this.isMounted_) this.setState({ received: json, isLoading: false });
            })
            .catch(err => { console.log(err); });
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }

    acceptJoinRequest(e) {
        let received = this.state.received;
        received.splice(e.target.value, 1);
        inboxService.accept_join_request(e.target.id, e.target.name)
            .then(json => {
                if (json.status === "success") {
                    if (this.isMounted_) this.setState({ received: received });
                } else {
                    console.log(json.message);
                }
            })
            .catch(err => { console.log(err); });
    }

    declineJoinRequest(e) {
        console.log("TBD");
        // let received = this.state.received;
        // received.splice(e.target.value, 1);
        // inboxService.remove_invitation(e.target.id, e.target.name)
        //     .then(json => {
        //         if (json.status === "success") {
        //             this.setState({ received: received });
        //         }
        //     })
        //     .catch(err => { console.log(err) });
    }

    render() {
        let key = 0;
        return (
            <div>
                {(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto p-3"></div>) ||
                    this.state.received.map((invite, index) => {
                        return (
                            <div key={key++} className="d-flex media text-muted border-bottom border-top border-gray">
                                <div className="d-flex media-body align-items-center small justify-content-between my-3">
                                    <div className="d-inline-flex">
                                        <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                                        <div className="flex-column">
                                            <div><strong className="text-dark-gray">From:</strong> <Link to={{ pathname: "/profile-" + invite.user_name, state: { _id: invite.user_id, username: invite.user_name } }} id={invite.user_id} style={{ 'textDecoration': 'none' }}>{invite.user_name}</Link></div>
                                            <div><b>Group:</b> <Link to={{ pathname: "/group-" + invite.project_id, state: { _id: invite.project_id } }} style={{ 'textDecoration': 'none' }}> {invite.project_title} </Link></div>
                                            <div><i>{invite.message}</i></div>
                                            <div><span className="badge badge-info p-2 mt-2">Join Request Received</span></div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <button className="btn btn-sm btn-outline-secondary mx-1" id={invite.project_id} name={invite.user_id} value={index} onClick={this.acceptJoinRequest.bind(this)}>Accept</button>
                                        <button className="btn btn-sm btn-outline-secondary mx-1" id={invite.project_id} name={invite.user_id} value={index} onClick={this.declineJoinRequest.bind(this)}>Decline</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        )
    }
}

export { JoinRequestsSent, JoinRequestsReceived };