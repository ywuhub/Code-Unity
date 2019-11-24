import React from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';

import { history } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute } from '@/_components';
import { HomePage } from '@/HomePage';
import { LoginPage, Register, ForgotPassword,ResetPasswordPage } from '@/LoginPage';
import { UserSearch } from '@/UserSearch';
import { userService } from '@/_services';
import '@/Style';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            username: "",
            avatar: ""
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
        userService.getUserAccountDetails().then(data => this.setState(
            {
                username: data.username,
                avatar: data.avatar
            }
        ));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser } = this.state;
        console.log(this.state.username);
        return (
            <Router history={history}>
                <div>
                    {currentUser &&
                        <nav className="navbar navbar-expand navbar-dark bg-dark" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div className="navbar-nav">
                                <Link to="/" className="nav-item nav-link" style={{ fontWeight: "bold", color: 'white' }}>
                                    Code Unity
                                </Link>
                            </div>

                            <div className="navbar-nav">
                               <UserSearch />                         
                            </div>

                            
                            <div className="navbar-nav">
                                <Link to="/" className="nav-item nav-link">Home</Link>
                                <Link to="/mygroup" className="nav-item nav-link">Projects</Link>
                                <li className="nav-item">
                                    <div className="dropdown">
                                        <button className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">
                                        <img src={this.state.avatar} className="nav-pic"></img>{this.state.username}
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="user">
                                            <a className="dropdown-item" href="/profile">Profile</a>
                                            <a className="dropdown-item" href="/inbox">Messages</a>
                                            <Link to={{ pathname: "/favourites" }} className="dropdown-item" style={{ textDecoration: 'none' }}> My Favourites </Link>

                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="/setting">Settings</a>
                                            <a onClick={this.logout} className="dropdown-item">Logout</a>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        </nav>

                    }
                    <div>
                        <Switch>
                            <Route exact path="/login" component={LoginPage} />
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/forgotPassword" component={ForgotPassword} />
                            <Route path="/reset/:token" render={(props) => (
                                <ResetPasswordPage {...props} />)
                            } />
                            <PrivateRoute path="/" component={HomePage} />
                        </Switch>

                    </div>
                </div>

            </Router>
        );
    }
}

export { App }; 