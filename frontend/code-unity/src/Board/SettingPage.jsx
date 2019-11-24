import React from 'react';
import '@/Style';
import { SkillBox } from '@/WebComponents';
import { userService } from '@/_services';
import { authenticationService } from '@/_services';

import { updateUser } from '@/QuickBlox';


class SettingPage extends React.Component {
    constructor(props) {
        super(props);
        this.putPassword = this.putPassword.bind(this);
        this.putUsername = this.putUsername.bind(this);
        this.state = {
            "PasswordNotification": false,
            "UsernameNotification": false,
            "PasswordNotificationContent": "",
            "UsernameNotificationContent": "",
            "updateSucceed":false,
            "updateContent":""
        }
    }
    componentDidMount() {
        this.setState({
            "PasswordNotification": false,
        });
    }

    putPassword(e) {
        e.preventDefault();
        if (this.refs.password_first.value != this.refs.password_second.value) {
            this.setState({
                "PasswordNotification": true,
                "PasswordNotificationContent": "Both passwords does not match. Please try again!"
            });
        } else {
            userService.postPassword(
                this.refs.password_first.value,
            ).then(
                status => {
                    if (status == "OK") {
                        this.setState({
                            "updateSucceed":true,
                            "updateContent":"Password has successfully updated."
                        });
                        $('#changePassword').modal('hide')
                    } else {
                        this.setState({
                            PasswordNotification:true,
                            PasswordNotificationContent:status});
                    }
                }
            )
        }
    }
    passwordModalReset() {
        this.setState({"PasswordNotification":false});
        document.getElementById("passwordField").reset();
    }

    usernameModalReset() {
        this.setState({"UsernameNotification":false});
        document.getElementById("usernameField").reset();
    }

    putUsername(e) {
        e.preventDefault();

        userService.postUsername(
            this.refs.edit_username.value,
        ).then(
            status => {
                if (status == "OK") {
                    var curr_id = authenticationService.currentUserValue.uid;
                    var newName = this.refs.edit_username.value;
                    QB.createSession({ login: curr_id, password: curr_id }, (err, res) => {
                        if (res) {
                            updateUser(curr_id, newName);
                        } else {
                            console.log(err);
                        }
                    });
                    this.setState({
                        "updateSucceed":true,
                        "updateContent":"Username has being successfully updated."
                    });
                    $('#changeUsername').modal('hide')
                } else {
                    this.setState({
                        UsernameNotification:true,
                        UsernameNotificationContent:status});
                }
            }
        )


    }

    render() {
        return(
            <div className="container-fluid">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h4">Setting</h1>
                    <div className="nav nav-tabs btn-group mr-2" role="tablist">
                    </div>
                </div>
                {this.state.updateSucceed &&
                  <div class="alert alert-success" role="alert">
                    {this.state.updateContent}
                  </div>
                }
                <div>
                    <ul className="list-group">
                        <li className="list-group-item list-group-item-secondary h5">Security Setting</li>
                        <li className="list-group-item">
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                            <div><i className="fas fa-key vertical-middle mr-3"></i>Change Password</div>
                                <div><a href="javascript:void(0)" 
                                        data-toggle="modal" 
                                        data-target="#changePassword"
                                        onClick={this.passwordModalReset.bind(this)}>
                                        Edit</a>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                <div><i className="fas fa-user mr-3"></i>Change Username</div>
                                <div>
                                    <a href="javascript:void(0)" 
                                        data-toggle="modal" 
                                        data-target="#changeUsername"
                                        onClick={this.usernameModalReset.bind(this)}>
                                        Edit
                                        </a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                    <div className="modal fade" id="changePassword" tabIndex="-1" role="dialog" aria-hidden="true" onHide={true}>
                      <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Change Password</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                              <form onSubmit={this.putPassword} id="passwordField">
                                  {
                                    this.state.PasswordNotification&&
                                    <div class="alert alert-danger ml-3 mr-3 mt-2 " role="alert">
                                        {this.state.PasswordNotificationContent}
                                    </div>
                                  }
                                  <div className="modal-body mb-3">
                                      <label htmlFor="exampleInputPassword1">Password</label>
                                      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter new password..." ref="password_first"/>
                                      <label className="mt-3" htmlFor="exampleInputPassword1">Verify Password</label>
                                      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Please confirm new password..." ref="password_second"/>
                                  </div>
                                  <div className="modal-footer">
                                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                      <button type="button" className="btn btn-primary" type="submit">Save changes</button>
                                  </div>
                              </form>
                        </div>
                      </div>
                    </div>
                    <div className="modal fade" id="changeUsername" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Change Username</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <form onSubmit={this.putUsername} id="usernameField">
                                  {
                                    this.state.UsernameNotification&&
                                    <div class="alert alert-danger ml-3 mr-3 mt-2 " role="alert">
                                        {this.state.UsernameNotificationContent}
                                    </div>
                                  }
                                  <div className="modal-body mb-3">
                                      <label htmlFor="exampleInputPassword1">New Username</label>
                                      <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter new username..." ref="edit_username"/>
                                  </div>
                                  <div className="modal-footer">
                                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                      <button type="button" className="btn btn-primary" type="submit">Save changes</button>
                                  </div>
                              </form>
                            </div>
                      </div>
                    </div>
            </div>

        );
    }

};
export { SettingPage };
