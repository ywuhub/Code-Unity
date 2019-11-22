import React from 'react';
import { inboxService } from '@/_services';
import { Route, Link, Switch } from 'react-router-dom';

class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            initialNotifications: [],
            notifications: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.isMounted_ = true;
        this.setState({ isLoading: true });
        inboxService.get_all_notifications()
            .then(json => {
                console.log(json);
                if (this.isMounted_) this.setState({ initialNotifications: json, notifications: json, isLoading: false });
            })
            .catch(err => { console.log(err); })
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }

    // change  just do each key hard code
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
            this.setState({ notifications: this.state.initialNotifications });

        } else {
            let invitations = this.state.initialNotifications.filter((invitation) => {
                return this.containsFilter(invitation, input);
            })
            this.setState({ notifications: invitations });
        }
    }

    dismiss(id, index, e) {
        let notifications = this.state.initialNotifications;
        notifications.splice(index, 1);
        inboxService.dismiss_notification(id)
            .then(json => {
                console.log(json);
                if (this.isMounted_) this.setState({ initialNotifications: notifications, notifications: notifications });
            });
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
                    this.state.notifications.map((notification, index) => {
                        const id = notification._id.$oid;
                        return (
                            <div key={key++} className="d-flex media text-muted border-bottom border-top border-gray">
                                <div className="d-flex media-body align-items-center small justify-content-between my-3">
                                    {notification.type === 'request' && <JoinRequest notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index}/>}
                                    {notification.type === 'invite' && <Invite notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index}/>}
                                    {notification.type === 'join' && <UserJoin notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index}/>}
                                    {notification.type === 'leave' && <UserLeave notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index}/>}
                                    {notification.type === 'kick' && <UserKicked notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index}/>}
                                    {notification.type === 'project_delete' && <ProjectDeleted notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index}/>}
                                </div>
                            </div>
                        );
                    })}
            </div>
        )
    }
}

function ProjectDeleted(props) {
    const title = props.notification.project_title;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div>Project <strong>{title}</strong> has been deleted</div>
                    <div><span className="badge badge-primary p-2 mt-2">{props.notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

function UserKicked(props) {
    const notification = props.notification;
    const kicked_user = notification.kicked_user;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div>
                        <strong><Link to={{ pathname: "/profile-" + kicked_user.username, state: { _id: kicked_user.id.$oid, username: kicked_user.username } }} id={kicked_user.id.$oid} style={{ 'textDecoration': 'none' }}>{kicked_user.username}</Link></strong>
                        &nbsp;has been kicked from project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div><span className="badge badge-primary p-2 mt-2">{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

function UserLeave(props) {
    const notification = props.notification;
    const left_user = notification.left_user;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div>
                        <strong><Link to={{ pathname: "/profile-" + left_user.username, state: { _id: left_user.id.$oid, username: left_user.username } }} id={left_user.id.$oid} style={{ 'textDecoration': 'none' }}>{left_user.username}</Link></strong>
                        &nbsp;has left project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div><span className="badge badge-primary p-2 mt-2">{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

function UserJoin(props) {
    const notification = props.notification;
    const joined_user = notification.joined_user;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div>
                        <strong><Link to={{ pathname: "/profile-" + joined_user.username, state: { _id: joined_user.id.$oid, username: joined_user.username } }} id={joined_user.id.$oid} style={{ 'textDecoration': 'none' }}>{joined_user.username}</Link></strong>
                        &nbsp;has joined project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div><span className="badge badge-primary p-2 mt-2">{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

function JoinRequest(props) {
    const notification = props.notification;
    const requester = notification.requester;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div>
                        <strong><Link to={{ pathname: "/profile-" + requester.username, state: { _id: requester.id.$oid, username: requester.username } }} id={requester.id.$oid} style={{ 'textDecoration': 'none' }}>{requester.username}</Link></strong>
                        &nbsp;has requested to join project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div><span className="badge badge-primary p-2 mt-2">{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

function Invite(props) {
    const notification = props.notification;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div>
                        You have been invited to project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div><span className="badge badge-primary p-2 mt-2">{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}



export { NotificationComponent };