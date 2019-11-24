import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'formik';
import '@/Style';
import { SkillBox } from '@/WebComponents';
import { userService, authenticationService } from '@/_services';
import { projectService } from '../_services';

class ResetPasswordPage extends React.Component {
    constructor(props) {
        super(props);
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }
        this.putPassword = this.putPassword.bind(this);
        this.state = {
            token: "",
            "PasswordNotification": false,
            "PasswordNotificationContent": "false"
        }
    }

    componentDidMount() {
    }
    putPassword(e) {
        e.preventDefault();
        if (this.refs.password_first.value != this.refs.password_second.value) {
            this.setState({
                "PasswordNotification": true,
                "PasswordNotificationContent": "Both passwords does not match. Please try again!"
            });
        } else {
            authenticationService.resetPassword(
                this.props.match.params.token,
                this.refs.password_first.value,
            ).then((response) => {
                if(!response.ok) throw new Error(response.status);
                else return response.json();
              })
              .then((data) => {
                    this.setState({
                        "updateSucceed":true,
                        "updateContent":data.message
                    });
                    setTimeout(() => {
                        this.props.history.push('/')
                    }, 5000);
                    $('#changePassword').modal('hide')
              })
              .catch((error) => {
                    this.setState({
                        PasswordNotification:true,
                        PasswordNotificationContent:status});
              });
        }
    }


    render() {
        let key_id = 0;

        return (
            <div>
                <div className="container mt-5" style={{ 'width': '700px' }}>
                    <div className="d-flex card-body flex-column shadow">
                        
                        <h2 className="card-title text-muted p-1 mb-4"> Reset Password </h2>
                              <form className="ml-2" onSubmit={this.putPassword} id="passwordField">
                                  {
                                    this.state.PasswordNotification&&
                                    <div className="alert alert-danger mt-2 " role="alert">
                                        {this.state.PasswordNotificationContent}
                                    </div>
                                  }
                                  {
                                    this.state.updateSucceed&&
                                    <div className="alert alert-success mt-2 " role="alert">
                                        {this.state.updateContent}
                                    </div>
                                  }
                                  <div className="mb-3">
                                      <label htmlFor="exampleInputPassword1">Password</label>
                                      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter new password..." ref="password_first"/>
                                      <label className="mt-3" htmlFor="exampleInputPassword1">Verify Password</label>
                                      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Please confirm new password..." ref="password_second"/>
                                  </div>
                                  <div className="mt-4 btn-toolbar justify-content-end">
                                      <button type="button" className="btn btn-danger ml-2" type="submit">Reset Password</button>
                                  </div>
                              </form>
                    </div>
                </div>
            </div>


        );
    }

}

export { ResetPasswordPage };