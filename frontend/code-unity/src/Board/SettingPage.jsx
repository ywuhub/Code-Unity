import React from 'react';
import '@/Style';
import { SkillBox } from '@/WebComponents';


class SettingPage extends React.Component {
    constructor(props) {
        super(props);
        this.putPassword = this.putPassword.bind(this);
        this.putEmail = this.putEmail.bind(this);
        this.state = {
            "PasswordNotification": false,
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
            });
        } 
    }
    passwordModalReset() {
        this.setState({"PasswordNotification":false});
        document.getElementById("passwordField").reset();
    }

    emailModalReset() {
        this.setState({"PasswordNotification":false});
        document.getElementById("emailField").reset();
    }

    putEmail(e) {
        e.preventDefault();

    }

    render() {
        return(
            <div className="container-fluid">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h4">Setting</h1>
                    <div className="nav nav-tabs btn-group mr-2" role="tablist">
                    </div>
                </div>
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
                                <div><i className="far fa-envelope mr-3"></i>Change Email</div>
                                <div>
                                    <a href="javascript:void(0)" 
                                        data-toggle="modal" 
                                        data-target="#changeEmail"
                                        onClick={this.emailModalReset.bind(this)}>
                                        Edit
                                        </a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                    <div className="modal fade" id="changePassword" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                        password does not match
                                    </div>
                                  }
                                  <div className="modal-body mb-3">
                                      <label htmlFor="exampleInputPassword1">Password</label>
                                      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" ref="password_first"/>
                                      <label className="mt-3" htmlFor="exampleInputPassword1">Verify Password</label>
                                      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" ref="password_second"/>
                                  </div>
                                  <div className="modal-footer">
                                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                      <button type="button" className="btn btn-primary" type="submit">Save changes</button>
                                  </div>
                              </form>
                        </div>
                      </div>
                    </div>
                    <div className="modal fade" id="changeEmail" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Change Email</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <form onSubmit={this.putEmail} id="emailField">
                                  <div className="modal-body mb-3">
                                      <label htmlFor="exampleInputPassword1">Email Address</label>
                                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"/>
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
