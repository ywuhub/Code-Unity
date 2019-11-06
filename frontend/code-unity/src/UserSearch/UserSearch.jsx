import React from 'react';
import config from 'config';
import { authHeader } from '@/_helpers';
import { Route, Link, Switch } from 'react-router-dom';
import { OthersProfile } from './OthersProfile';

import '@/Style';

let selectedUser = '';

class UserSearch extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            initialUsers: [],
            users: [],
            isLoading: false
        };
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }
    
    componentDidMount() {
        this.isMounted_ = true;
        this.setState({ isLoading: true });
        const options = { method:'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };
        fetch(`${config.apiUrl}/api/user_list`, options)
            .then(response => { return response.json(); })
            .then(users => {
                if (this.isMounted_) this.setState({ initialUsers: users });
            })
            .catch(err => { console.log(err); });
    }

    handleUserInput(e) {
        let filter = e.target.value.toLowerCase();
        let users = this.state.initialUsers;
        
        if (/^(\s+|)$/.test(filter)) {
            this.setState({ users: [] }); 
            return;
        }

        let users_ = users.filter((user) => {
            return user['username'].toLowerCase().startsWith(filter) || user['email'].toLowerCase().startsWith(filter);
        });

        this.setState({ users: users_ });
    }

    onUserSelect(e) {
        selectedUser = e.target.value;
        document.getElementById('user-search').value = '';
        if (this.isMounted_) this.setState({ users: [] });
    }

    render() {
        return (
            <div className="mx-3" style={{'width':'25vw', 'position':'relative'}}>
                <div id="user-search-bar" className="input-group" tabIndex="0">
                    <input type="text" id="user-search" className="form-control bg-transparent pr-5 pl-3 border-0" style={{'fontSize':'14px', 'color':'white' }} placeholder="Search for users by username or email" onChange={this.handleUserInput.bind(this)} ></input>
                        <div className="input-group-append">
                        <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                    </div>
                </div>    

                <div className="btn-group-vertical border" id="user-search-dropdown" style={{ 'position': 'absolute', 'zIndex': '1', 'width': '100%' }}>
                    {
                        this.state.users.map((user) => {
                            return (
                                <Link to={{pathname: "/profile-" + user.username, state: { _id: user._id, username: user.username }}} className="bg-light w-100 p-2 user-search-link" key={user._id} style={{'textDecoration':'none'}} value={user.username} onClick={this.onUserSelect.bind(this)}>
                                    <div className="media" value={user.username}>
                                        <img src="https://api.adorable.io/avatars/200/avatar.png" className="p-2 img-fluid img-circle d-block rounded-circle" value={user.username} style={{'width':'50px'}} alt="avatar" />
                                        <div className="media-body" value={user.username}>
                                            <div className="d-flex justify-content-start flex-column text-muted">
                                                <b className="" value={user.username}>{user.username}</b>
                                                <i className="" value={user.username}><small value={user.username}> {user.email} </small></i>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>  

            </div>
        );
    }
}

export {UserSearch};