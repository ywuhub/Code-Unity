import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import { CreateGroup } from '@/CreateGroup';
import { Notification } from '@/WebComponents';
import { GroupCard } from '@/WebComponents';
import { MyGroup } from '@/Board';
import { userService, inboxService } from '@/_services';
import { JoinRequest, Invite, UserJoin, UserLeave, UserKicked, ProjectDeleted } from '@/Inbox'

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            "_id": "??",
            isloading: true,
            projectData: [],
            notifications: [],
            notificationLoading: true
            // isEditing: false
        };
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }

    componentDidMount() {
        this.isMounted_ = true;
        console.log("========componentWillReceiveProps")
        if (this.props._id) {
            userService.getUserProject(this.props._id).then(data => {
                if (this.isMounted_) {
                    this.setState({
                        isloading: false,
                        projectData: data
                    });
                }
            })

            inboxService.get_all_notifications()
                .then(notifications => {
                    this.setState({ notifications: notifications, notificationLoading: false });
                })
        }
    }

    dismiss(id, index, e) {
        let notifications = this.state.notifications;
        notifications.splice(index, 1);
        inboxService.dismiss_notification(id)
            .then(json => {
                console.log(json);
                if (this.isMounted_) this.setState({ notifications: notifications });
            });
    }

    render() {
        let key = 0;
        let num_cards = 8; // Number of groups to display
        return (
            <div>
                <div className="my-3 p-3 bg-white rounded shadow-sm">
                    <h6 className="border-bottom border-gray pb-2 mb-0">Groups</h6>
                    <div className="row">
                    {(this.state.isloading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>) ||
                        (this.state.projectData.slice(0, num_cards) || []).map((item) => {
                            return(
                                <div key={item.project_id} className="col-3">
                                    <GroupCard  title={item.title}
                                                address={"/mygroup/"+item.project_id}
                                                current_number={item.cur_people}
                                                max_number={item.max_people}
                                                description={item.description}
                                                leader={item.leader}
                                                members={item.members}/>
                                </div>
                            )
                        })
                    }
                    </div>
                    {!this.state.isloading && !this.state.projectData.length && <div><br></br><center>You are not currently in any groups.</center></div>}
                    <small className="d-block text-right mt-3 border-top homepg-btns">
                        <br></br>
                        <div className="btn-toolbar mb-2 mb-md-0 homepg-btns" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span><a className="btn btn-sm btn-outline-secondary" href="/CreateGroup">Create New Group</a></span>
                            <span><a className="btn btn-sm btn-outline-secondary" href="/mygroup">View All Groups</a></span>
                        </div>
                    </small>
                </div>
                <div className="my-3 p-3 bg-white rounded shadow-sm">
                    <h6 className="border-bottom border-gray pb-2 mb-0">Notifications</h6>
                    {(this.state.notificationLoading && <div className="d-flex spinner-border text-dark mx-auto p-3 mt-3"></div>) ||
                        this.state.notifications.slice(0, 3).map((notification, index) => {
                            const id = notification._id.$oid;
                            return (
                                <div key={key++} className="d-flex media text-muted border-bottom border-top border-gray">
                                    <div className="d-flex media-body align-items-center small justify-content-between my-3">
                                        {notification.type === 'request' && <JoinRequest notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index} />}
                                        {notification.type === 'invite' && <Invite notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index} />}
                                        {notification.type === 'join' && <UserJoin notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index} />}
                                        {notification.type === 'leave' && <UserLeave notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index} />}
                                        {notification.type === 'kick' && <UserKicked notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index} />}
                                        {notification.type === 'project_delete' && <ProjectDeleted notification={notification} dismiss={this.dismiss.bind(this, id, index)} index={index} />}
                                    </div>
                                </div>
                            );
                        })}
                    {!this.state.notificationLoading && !this.state.notifications.length && <div className="border-bottom"><br></br><center>You have no new notifications.</center><br></br></div>}
                    <small className="d-block text-right mt-3">
                        <a href="/inbox">All Notifications</a>
                    </small>
                </div>
                <Switch>
                    <Route path="/CreateGroup" component={CreateGroup} />
                    <Route path="/mygroup" component={MyGroup} />
                </Switch>
            </div>
        );
    }

}

export { Dashboard };
