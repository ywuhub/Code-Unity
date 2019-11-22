import React from 'react';
import { inboxService } from '@/_services';
import { JoinRequest, Invite, UserJoin, UserLeave, UserKicked, ProjectDeleted } from './NotificationDetails';

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

    containsFilter(notification, filter) {
        let contains = false;
        for (let key of Object.keys(notification)) {
            if (typeof notification[key] === 'string') contains = (notification[key].toLowerCase().indexOf(filter) !== -1);
            else if (notification[key].username) contains = (notification[key].username.toLowerCase().indexOf(filter) !== -1);
            // else contains = (Array.from(notification[key]).toString().toLowerCase().indexOf(filter) !== -1);
            if (contains) break;
        }
        return contains;
    }


    filter(e) {
        const input = e.target.value.toLowerCase();

        if (/^(\s+|)$/.test(input)) {
            this.setState({ notifications: this.state.initialNotifications });

        } else {
            let notifications = this.state.initialNotifications.filter((notification) => {
                return this.containsFilter(notification, input);
            })
            this.setState({ notifications: notifications });
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

    dismiss_all(e) {
        inboxService.dismiss_all_notifications()
            .then(json => {
                if (this.isMounted_) this.setState({ initialNotifications: [], notifications: [] });
            });
    }

    render() {
        let key = 0;
        return (
            <div>
                <div className="d-flex justify-content-center ">
                    <div className="input-group bg-light border-bottom shadow-sm rounded-pill mb-4 w-75">
                        <input type="text" id="search-bar" className="form-control bg-transparent rounded-pill p-4 pr-5 border-0" placeholder="Search" onChange={this.filter.bind(this)}></input>
                        <div className="input-group-append">
                            <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                        </div> 
                    </div>
                </div>
                <div className="d-flex justify-content-end border-bottom">
                    <button className="btn btn-sm btn-outline-secondary" onClick={this.dismiss_all.bind(this)}>Clear All Notifications</button>      
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

export { NotificationComponent };