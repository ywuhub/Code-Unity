import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import { CreateGroup } from '@/CreateGroup';
import { Notification } from '@/WebComponents';

class Dashboard extends React.Component {
	// constructor(props) {
 //        super(props);
 //    }

    addNotification() {

    }
    render() {
        return (
            <div>
                <div class="my-3 p-3 bg-white rounded shadow-sm">
                    <h6 class="border-bottom border-gray pb-2 mb-0">Search</h6>
                    <br></br>
                    <form class="form-inline md-form form-sm">
                        <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search for groups or members"
                            aria-label="Search"></input>
                        <i class="fas fa-search" aria-hidden="true"></i>
                    </form>
                </div>
                <div class="my-3 p-3 bg-white rounded shadow-sm">
                    <h6 class="border-bottom border-gray pb-2 mb-0">Groups</h6>
                    <div class="media text-muted pt-3">
                        <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#6f42c1"></rect><text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text></svg>
                        <p class="media-body pb-3 mb-0 small lh-125">
                            <strong class="d-block text-gray-dark">Project 1</strong>
                        </p>
                        <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#6f42c1"></rect><text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text></svg>
                        <p class="media-body pb-3 mb-0 small lh-125">
                            <strong class="d-block text-gray-dark">Project 2</strong>
                        </p>
                    </div>
                    <small class="d-block text-right mt-3 border-top">
                        <br></br>
                        <div class="btn-toolbar mb-2 mb-md-0">
                            <div class="btn-group mr-2">
                                <a class="nav-link active" href="/CreateGroup">Create New Group</a>
                            </div>
                        </div>
                    </small>
                </div>
                <div class="my-3 p-3 bg-white rounded shadow-sm">
                    <h6 class="border-bottom border-gray pb-2 mb-0">Notifications</h6>
                    <div class="media text-muted pt-3">
                        <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                        <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                            <strong class="d-block text-gray-dark">Server: Group Message</strong>
                            You have successfully joined group "Hacking project".
                      </p>
                    </div>
                    <div class="media text-muted pt-3">
                        <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                        <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                            <strong class="d-block text-gray-dark">From: Jessica</strong>
                            Do you want to have dinner with me?
                      </p>
                    </div>
                    <div class="media text-muted pt-3">
                        <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#6f42c1"></rect><text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text></svg>
                        <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                            <strong class="d-block text-gray-dark">Server: Group Invitation</strong>
                            Allen invites you to join group "web development"
                      </p>
                    </div>
                    <small class="d-block text-right mt-3">
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