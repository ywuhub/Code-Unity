import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import { CreateGroup } from '@/CreateGroup';
import { Notification } from '@/WebComponents';
import { GroupCard } from '@/WebComponents';
import { userService } from '@/_services';

class Dashboard extends React.Component {
	constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            "_id":"??",
            isloading: true,
            projectData:[]
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
        }
    }
    addNotification() {

    }
    render() {
        let key = 0;
        return (
            <div>
                <div className="my-3 p-3 bg-white rounded shadow-sm">
                    <h6 className="border-bottom border-gray pb-2 mb-0">Groups</h6>
                    <div className="row">
                    {(this.state.isloading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>) ||
                        (this.state.projectData || []).map((item) => {
                            return(
                                <div key={key++} className="col-3">
                                    <GroupCard title={item.title}
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
                    <small className="d-block text-right mt-3 border-top">
                        <br></br>
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <div className="btn-group mr-2">
                                <a className="btn btn-sm btn-outline-secondary" href="/CreateGroup">Create New Group</a>
                            </div>
                        </div>
                    </small>
                </div>
                <div className="my-3 p-3 bg-white rounded shadow-sm">
                    <h6 className="border-bottom border-gray pb-2 mb-0">Notifications</h6>
                    <div className="media text-muted pt-3">
                        <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                        <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                            <strong className="d-block text-gray-dark">Server: Group Message</strong>
                            You have successfully joined group "Hacking project".
                      </p>
                    </div>
                    <div className="media text-muted pt-3">
                        <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                        <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                            <strong className="d-block text-gray-dark">From: Jessica</strong>
                            Do you want to have dinner with me?
                      </p>
                    </div>
                    <div className="media text-muted pt-3">
                        <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#6f42c1"></rect><text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text></svg>
                        <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                            <strong className="d-block text-gray-dark">Server: Group Invitation</strong>
                            Allen invites you to join group "web development"
                      </p>
                    </div>
                    <small className="d-block text-right mt-3">
                        <a href="#">All Notifications</a>
                    </small>
                </div>
                <Switch>
                    <Route path="/CreateGroup" component={ CreateGroup } />
                </Switch>
            </div>
        );
    }

}

export { Dashboard };