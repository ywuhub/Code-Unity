import React from 'react';
import { inboxService } from '@/_services';
import { Route, Link, Switch } from 'react-router-dom';

class InviteSentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            initialSent: [],
            sent: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.isMounted_ = true;
        this.setState({ isLoading: true });
        inboxService.get_invites_sent()
            .then(json => {
                if (this.isMounted_) this.setState({ initialSent: json, sent: json, isLoading: false });
            })
            .catch(err => { console.log(err); })
    }

    removeInvitation(project_id, user_id, index, e) {
        let sent = this.state.initialSent;
        sent.splice(index, 1);
        inboxService.remove_invitation(project_id, user_id)
            .then(json => {
                if (json.status === "success") {
                    if (this.isMounted_) this.setState({ initialSent: sent, sent: sent });
                } else {
                    console.log(json.message);
                }
            })
            .catch(err => { console.log(err) });
    }

    containsFilter(invitation, filter) {
        let contains = false;
        for (let key of Object.keys(invitation)) {
            if (typeof invitation[key] === 'string') contains = (invitation[key].toLowerCase().indexOf(filter) !== -1);
            else contains = (Array.from(invitation[key]).toString().toLowerCase().indexOf(filter) !== -1);
            if (contains) break;
        }
        return contains;
    }

    filter(e) {
        const input = e.target.value.toLowerCase();

        if (/^(\s+|)$/.test(input)) {
            this.setState({ sent: this.state.initialSent });

        } else {
            let invitations = this.state.initialSent.filter((invitation) => {
                return this.containsFilter(invitation, input);
            })
            this.setState({ sent: invitations });
        }
    }

    render() {
        let key = 0;
        return (
            <div>
                <div className="d-flex justify-content-center border-bottom">
                    <div className="input-group bg-light border-bottom shadow-sm rounded-pill mb-4 w-75">
                        <input type="text" id="search-bar" className="form-control bg-transparent rounded-pill p-4 pr-5 border-0" placeholder="Search" onChange={this.filter.bind(this)}></input>
                        <div className="input-group-append">
                            <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                        </div>
                    </div>
                </div>
                {(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto p-3 mt-3"></div>) ||
                    this.state.sent.map((invite, index) => {
                        return (
                            <div key={key++} className="d-flex media text-muted border-bottom border-top border-gray">
                                <div className="d-flex media-body align-items-center small justify-content-between my-3">
                                    <div className="d-inline-flex">
                                        <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                                        <div className="flex-column">
                                            <div><strong className="text-dark-gray">To:</strong> <Link to={{ pathname: "/profile-" + invite.user_name, state: { _id: invite.user_id, username: invite.user_name } }} id={invite.user_id} style={{ 'textDecoration': 'none' }}>{invite.user_name}</Link></div>
                                            <div><b>Group:</b> <Link to={{ pathname: "/group-" + invite.project_id, state: { _id: invite.project_id } }} style={{ 'textDecoration': 'none' }}> {invite.project_title} </Link></div>
                                            <div><span className="badge badge-primary p-2 mt-2">Invite Sent</span></div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <button className="btn btn-sm btn-outline-secondary mx-1" onClick={this.removeInvitation.bind(this, invite.project_id, invite.user_id, index)}>Cancel Invite</button>
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
        this.isMounted_ = false;
        this.state = {
            initialReceived: [],
            received: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.isMounted_ = true;
        this.setState({ isLoading: true });
        inboxService.get_invites_received()
            .then(json => {
                if (this.isMounted_) this.setState({ initialReceived: json, received: json, isLoading: false });
            })
            .catch(err => { console.log(err); });
    }

    acceptInvitation(project_id, index, e) {
        let received = this.state.initialReceived;
        received.splice(index, 1);
        inboxService.accept_join_invitation(project_id)
            .then(json => {
                if (json.status === "success") {
                    if (this.isMounted_) this.setState({ initialReceived: received, received: received });
                } else {
                    console.log(json.message);
                }
            })
            .catch(err => { console.log(err); });
    }

    declineInvitation(project_id, user_id, index, e) {
        let received = this.state.initialReceived;
        received.splice(index, 1);
        inboxService.remove_invitation(project_id, user_id)
            .then(json => {
                if (json.status === "success") {
                    if (this.isMounted_) this.setState({ initialReceived: received, received: received });
                } else {
                    console.log(json.message);
                }
            })
            .catch(err => { console.log(err) });
    }

    containsFilter(invitation, filter) {
        let contains = false;
        for (let key of Object.keys(invitation)) {
            if (typeof invitation[key] === 'string') contains = (invitation[key].toLowerCase().indexOf(filter) !== -1);
            else contains = (Array.from(invitation[key]).toString().toLowerCase().indexOf(filter) !== -1);
            if (contains) break;
        }
        return contains;
    }

    filter(e) {
        const input = e.target.value.toLowerCase();

        if (/^(\s+|)$/.test(input)) {
            this.setState({ sent: this.state.initialReceived });

        } else {
            let invitations = this.state.initialReceived.filter((invitation) => {
                return this.containsFilter(invitation, input);
            })
            this.setState({ received: invitations });
        }
    }

    render() {
        let key = 0;
        return (
            <div>
                <div className="d-flex justify-content-center border-bottom">
                    <div className="input-group bg-light border-bottom shadow-sm rounded-pill mb-4 w-75">
                        <input type="text" id="search-bar" className="form-control bg-transparent rounded-pill p-4 pr-5 border-0" placeholder="Search" onChange={this.filter.bind(this)}></input>
                        <div className="input-group-append">
                            <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                        </div>
                    </div>
                </div>
                {(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto p-3 mt-3"></div>) ||
                    this.state.received.map((invite, index) => {
                        return (
                            <div key={key++} className="d-flex media text-muted border-bottom border-top border-gray">
                                <div className="d-flex media-body align-items-center small justify-content-between my-3">
                                    <div className="d-inline-flex">
                                        <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                                        <div className="flex-column">
                                            <div><strong className="text-dark-gray">From:</strong> <Link to={{ pathname: "/profile-" + invite.user_name, state: { _id: invite.user_id, username: invite.user_name } }} id={invite.user_id} style={{ 'textDecoration': 'none' }}>{invite.user_name}</Link></div>
                                            <div><b>Group:</b> <Link to={{ pathname: "/group-" + invite.project_id, state: { _id: invite.project_id } }} style={{ 'textDecoration': 'none' }}> {invite.project_title} </Link></div>
                                            <div><span className="badge badge-info p-2 mt-2">Invite Received</span></div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <button className="btn btn-sm btn-outline-secondary mx-1" onClick={this.acceptInvitation.bind(this, invite.project_id, index)}>Accept</button>
                                        <button className="btn btn-sm btn-outline-secondary mx-1" onClick={this.declineInvitation.bind(this, invite.project_id, invite.user_id, index)}>Decline</button>
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