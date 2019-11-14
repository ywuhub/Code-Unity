import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import { projectService } from '@/_services';

class JoinRequests extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            _id : '',
            projectRequests: []
        };
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }

    componentDidMount() {
        this.isMounted_ = true;
        projectService.join_requests(true).then(requests => {
            this.setState({
                projectRequests: requests
            })
        })
    }

    handleAccept(key, project_id, user_id) {
        projectService.accept_request(project_id, user_id, "request");
        this.state.projectRequests.splice(key, 1);
        this.setState({});
    }

    render() {
        let key = -1;
        console.log(this.state.projectRequests);
        return (
            <div>
                <div className="my-3 p-3 bg-white rounded shadow-sm">
                    <h4 className="border-bottom border-gray pb-2 mb-0">Join Requests</h4>
                    {!this.state.projectRequests.length && <div><br></br><center>No join requests at the moment.</center></div>}                   
                    {this.state.projectRequests.map((request) => {
                        return <div key={key++} className="media text-muted pt-3 border-bottom border-gray">
                            <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                            <p className="media-body pb-3 mb-0 small lh-125">
                                <strong className="d-block text-gray-dark">From: {request.user_name}</strong>
                                <i className="fas fa-book-reader"></i> &nbsp;<b>Group:</b> {request.project_title}<br></br>
                                <i className="fas fa-tags"></i> <b>Message: </b> {request.message}
                            </p>
                            <small className="d-block text-right mt-3 ">
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => {this.handleAccept(key, request.project_id, request.user_id)}}>Accept</button>
                            </small>
                            &nbsp;&nbsp;
                            <small className="d-block text-right mt-3 ">
                                <a className="btn btn-sm btn-outline-secondary" href="#">Decline</a>
                            </small>
                        </div>;
                    })}                        
                    
                </div>
            </div>
        );
    }

}

export { JoinRequests };