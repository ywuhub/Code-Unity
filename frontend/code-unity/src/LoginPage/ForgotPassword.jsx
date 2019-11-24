import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authenticationService } from '@/_services';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }
        this.state = {
            success: false,
            successData: ""
        }
    }

    change(e) {
        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <div className="container mt-5" style={{ 'width': '700px' }}>
                    <div className="d-flex card-body flex-column shadow">
                        
                        <h2 className="card-title text-muted p-1 mb-4"> Forgot Password </h2>
                        {this.state.success ?
                            <p> {this.state.successData}</p>
                            :
                            <Formik
                                initialValues={{
                                    email: '',

                                }}
                                validationSchema={Yup.object().shape({
                                    email: Yup.string().required('Email is required'),
                                })}
                                onSubmit={({ email}, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    authenticationService.forgotPassword(email)
                                        .then(data => {
                                                this.setState({ 
                                                    success: true,
                                                    successData: data.message
                                                 });
                                            },
                                            error => {
                                                setSubmitting(false);
                                                setStatus("Email is not registered to an Code Unity account. Please try again!");
                                            }
                                        );

                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                    <Form>
                                        {status &&
                                            <div className="alert alert-danger alert-dismissible fade show" id="notification">
                                                <button type="button" className="close" onClick={() => ($('#notification').hide())}>&times;</button>
                                                {status}
                                            </div>
                                        }
                                        <div className="form-group">
                                            <label htmlFor="username" className="input-group-text text-muted bg-transparent border-0">Email</label>
                                            <div className="form-group input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text border-0 bg-transparent"> <i className="fa fa-envelope"></i> </span>
                                                </div>
                                                <Field name="email" type="email" id="email" className={'bg-light ' + 'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} placeholder="Enter Email" />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between form-group mt-5">
                                            <Link to="/login">Back</Link>
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Reset</button>
                                        </div>
                                    </Form>
                                )}
                            />
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export { ForgotPassword };