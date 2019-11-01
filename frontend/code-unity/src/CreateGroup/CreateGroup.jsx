import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import config from 'config';
import { projectService } from '@/_services';
import { authHeader } from '@/_helpers';

class CreateGroup extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            description: '',
            initialProg: [],
            selectedProg: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ description: event.target.value });
    }

    handleProgChange(event) {
        let prog = event.target.value;
        prog.push(event.target.value);
        this.setState({ selectedProg: prog });
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }

    componentDidMount() {
        this.isMounted_ = true;
        const prog_lang_options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() } };
        fetch(`${config.apiUrl}` + '/api/programming_languages', prog_lang_options)
            .then(response => { return response.json() })
            .then(progs => {
                if (this.isMounted_) {
                    this.setState({
                        initialProg: progs
                    });
                }
            })
            .catch(err => { console.log(err); });
    }

    render() {
        {/* Setup dropdown menu for prog languages */}
        let progDropdown = this.state.initialProg.map((prog) => <option key={prog}>{prog}</option>);

        return (
            <div id="page-start">
                <div class="my-3 p-3 bg-white rounded shadow-sm">
                    <h2 className="card-title text-muted p-1 mb-4"> Create a Group </h2>

                    <Formik
                        initialValues={{
                            title: '',
                            max_people: 1,
                        }}
                        validationSchema={Yup.object().shape({
                            title: Yup.string().required('title is required')
                        })}
                        onSubmit={({ title, max_people }, { setStatus, setSubmitting }) => {
                            setStatus();
                            projectService.create_group(title, max_people, this.state.description, this.state.selectedProg)
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
                                    <label htmlFor="title" className="pb-2 mb-0">Title</label>
                                    <div className="form-group input-group">
                                        {/* <input type="text" id="title" className="form-control bg-dark rounded py-2" placeholder="Enter title" style={{ 'color': 'white' }} required></input> */}
                                        <Field name="title" type="text" id="title" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')}/>
                                        <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title" className="pb-2 mb-0">Number of members</label>
                                    <div className="form-group input-group">
                                        {/* <input type="text" id="title" className="form-control bg-dark rounded py-2" placeholder="Enter title" style={{ 'color': 'white' }} required></input> */}
                                        <Field name="max_people" type="number" id="max_people" min="1" className={'form-control'} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title" className="pb-2 mb-0">Programming Languages</label>
                                    <select class="custom-select" data-dropup-auto="false" onChange={event => this.handleProgChange(event)}>
                                        {progDropdown}
                                    </select>
                                    {/* Show tags */}
                                    <div className="my-3 border-0 p-0 px-2">
                                        <div id="tags">
                                            {
                                                this.state.selectedProg.map((tag) => {
                                                    return (
                                                        <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={tag}>{tag}<button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={tag} style={{ 'outline': 'none' }}></button></span>
                                                    );
                                                })}
                                            <br />

                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title" className="pb-2 mb-0">Description</label>
                                    <div className="form-group input-group">
                                        {/* <input type="text" id="title" className="form-control bg-dark rounded py-2" placeholder="Enter title" style={{ 'color': 'white' }} required></input> */}
                                        <textarea name="description" value={this.state.description} onChange={this.handleChange} type="text" id="description" rows="3" className={'form-control'} placeholder="Write a description" />
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