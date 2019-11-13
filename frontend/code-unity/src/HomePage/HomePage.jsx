import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import { userService, authenticationService } from '@/_services';
import { Dashboard, GroupList, GroupChat, Profile, MyGroup, GroupPage, JoinRequests } from '@/Board';
import { CreateGroup } from '@/CreateGroup';
import { OthersProfile } from '@/UserSearch';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUserId: authenticationService.currentUserValue.uid,
            // "_id": "",
            // "name": "",
            // "email": "",
            // "visibility": "",
            // "description": "",
            // "interests": [],
            // "programming_languages": [],
            // "languages": [],
            // "github": ""
        };
    }

    componentDidMount() {
        // userService.getProfile().then(data => this.setState({ 
        //     "_id": data._id,
        //     "name": data.name,
        //     "email": data.email,
        //     "visibility": data.visibility,
        //     "description": data.description,
        //     "interests": data.interests,
        //     "programming_languages": data.programming_languages,
        //     "languages": data.languages,
        //     "github": data.github
        // }));
    }

    render() {
        // const { currentUser, users } = this.state;
        const myGroupRouter = ( () =>  (
            <Switch>
                    <Route exact path="/mygroup" render={(props) => (
                        <MyGroup _id={this.state.currentUserId} {...props}/>
                      )}/>
                    <Route exact path="/mygroup/:project_id" render={(props) => (
                        <MyGroup _id={this.state.currentUserId} {...props}/>
                      )}/>
                    <Route exact path="/mygroup/edit/:project_id" render={(props) => (
                        <MyGroup _id={this.state.currentUserId}
                                  isEdit={true} {...props}/>
                      )}/>
            </Switch>
          )
        )
        return (
            <div className="container-fluid">
                <div className="row">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                  <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                      <li className="nav-item">
                       <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                          <span>Dashboard</span>
                          <a className="d-flex align-items-center text-muted" href="#">
                            <span data-feather="plus-circle"></span>
                          </a>
                        </h6>
                        <a className="nav-link active" href="/groupchat">
                          <span data-feather="home"></span>
                          Group Chat <span className="sr-only">(current)</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <span data-feather="file"></span>
                          Friends
                          <span className="badge badge-pill bg-light align-text-bottom">27</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <span data-feather="shopping-cart"></span>
                          Messages
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/profile">
                          <span data-feather="shopping-cart"></span>
                          My Profile
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/mygroup">
                          <span data-feather="shopping-cart"></span>
                          My Groups
                        </a>
                      </li>
                    </ul>

                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                      <span>Group infos</span>
                      <a className="d-flex align-items-center text-muted" href="#">
                        <span data-feather="plus-circle"></span>
                      </a>
                    </h6>
                    <ul className="nav flex-column mb-2">
                      <li className="nav-item">
                        <a className="nav-link" href="/groupList">
                          <span></span>
                        Group List
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/CreateGroup">
                          <span data-feather="file-text"></span>
                        Create a Group
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/JoinRequests">
                          <span data-feather="file-text"></span>
                          Join Requests
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <span data-feather="file-text"></span>
                          Coming Soon...
                        </a>
                      </li>
                    </ul>
                  </div>
                </nav>

                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                <Switch>
                    <Route path="/grouplist" component={GroupList} />
                    <Route exact path="/" render={() => (
                        <Dashboard _id={this.state.currentUserId}/>
                      )} />
                    <Route path="/groupchat" component={GroupChat} />
                    <Route path="/profile-:user" render={(props) => (
                      <OthersProfile key={props.match.params.user} {...props} />)
                    } />
                    <Route path="/profile" component={Profile} />
                    <Route path="/CreateGroup" component={CreateGroup} />
                    <Route path="/JoinRequests" render={(props) => (
                        <JoinRequests _id={this.state.currentUserId} {...props}/>)
                    } />
                    <Route path="/mygroup" component={myGroupRouter}/>
                    <Route path="/group-:project" render={(props) => (
                        <GroupPage {...props} />)
                    } />
                </Switch>

                </main>
                </div>
            </div>
        );
    }
}

export { HomePage };