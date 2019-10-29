import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { projectService } from '@/_services';

class CreateGroup extends React.Component {
    // constructor(props) {
    //        super(props);
    //    }

    render() {
        return (
            <div>
                <div class="my-3 p-3 bg-white rounded shadow-sm">
                    <h2 className="card-title text-muted p-1 mb-4"> Create a Group </h2>

                    <Formik
                        initialValues={{
                            title: '',
                            max_people: 1
                        }}
                        validationSchema={Yup.object().shape({
                            title: Yup.string().required('title is required')
                        })}
                        onSubmit={({ title, max_people }, { setStatus, setSubmitting }) => {
                            setStatus();
                            projectService.create_group(title, max_people)
                                .then(
                                    user => {
                                        const { from } = this.props.location.state || { from: { pathname: "/" } };
                                        this.props.history.push(from);
                                    },
                                    error => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                        }}
                        render={({ errors, status, touched, isSubmitting }) => (
                            <Form>
                                {status &&
                                    <div className="alert alert-danger alert-dismissible fade show">
                                        <button type="button" className="close" data-dismiss="alert">&times;</button>
                                        {status}
                                    </div>
                                }
                                <div className="form-group">
                                    <label htmlFor="title" className="input-group-text text-muted bg-transparent border-0">Title</label>
                                    <div className="form-group input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text border-0 bg-transparent"> <i className="fa fa-user"></i> </span>
                                        </div>
                                        {/* <input type="text" id="title" className="form-control bg-dark rounded py-2" placeholder="Enter title" style={{ 'color': 'white' }} required></input> */}
                                        <Field name="title" type="text" id="title" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} placeholder="Enter title" />
                                        <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between form-group mt-5">
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Create Group</button>
                                </div>
                            </Form>
                        )}
                    />
                </div>
            </div >

        )
    }

}

export { CreateGroup };