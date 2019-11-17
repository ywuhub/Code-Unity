import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import config from 'config';
import { projectService } from '@/_services';
import { authHeader } from '@/_helpers';
import { authenticationService } from '@/_services';
import { QBcreateGroup } from '@/QuickBlox';

class CreateGroup extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.handleChange = this.handleChange.bind(this);
        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.menuSelect = this.menuSelect.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.state = {
            course: '',
            courseList: [],
            description: '',
            initialLang: [],
            selectedLang: [],
            initialProg: [],
            selectedProg: [],
            initialTag: [],
            selectedTag: []
        };
    }

    handleChange(event) {
        this.setState({ description: event.target.value });
    }

    handleMenuChange(event) {
        if (event.target.name == 'lang-menu') {
            this.menuSelect(this.state.selectedLang, event.target.value);
        } else if (event.target.name == 'prog-menu') {
            this.menuSelect(this.state.selectedProg, event.target.value);
        } else if (event.target.name == 'tag-menu') {
            this.menuSelect(this.state.selectedTag, event.target.value);
        }
        this.setState({});
    }

    handleCourseChange(event) {
        this.setState({ course: event.target.value });
    }

    menuSelect(selected, value) {
        if (selected.length === 0 || selected.indexOf(value) === -1) {
            selected.push(value);
        }
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }

    componentDidMount() {
        this.isMounted_ = true;
        const lang_options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() } };
        fetch(`${config.apiUrl}` + '/api/list/languages', lang_options)
            .then(response => { return response.json() })
            .then(langs => {
                if (this.isMounted_) {
                    this.setState({
                        initialLang: langs,
                    });
                }
            })
            .catch(err => { console.log(err); });
        const prog_lang_options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() } };
        fetch(`${config.apiUrl}` + '/api/programming_languages', prog_lang_options)
            .then(response => { return response.json() })
            .then(progs => {
                if (this.isMounted_) {
                    this.setState({
                        initialProg: progs,
                    });
                }
            })
            .catch(err => { console.log(err); });
        const tag_options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() } };
        fetch(`${config.apiUrl}` + '/api/list/technologies', tag_options)
            .then(response => { return response.json() })
            .then(tags => {
                if (this.isMounted_) {
                    this.setState({
                        initialTag: tags,
                    });
                }
            })
            .catch(err => { console.log(err); });
        const course_options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() } };
        fetch(`${config.apiUrl}` + '/api/course_list', course_options)
            .then(response => { return response.json() })
            .then(courses => {
                if (this.isMounted_) {
                    this.setState({
                        courseList: courses,
                    });
                }
            })
            .catch(err => { console.log(err); });
    }

    removeTag(e) {
        if (event.target.name == 'lang-tag') {
            let tags = this.state.selectedLang;
            this.setState({ selectedLang: this.spliceArray(tags, event.target.value) });
        } else if (event.target.name == 'prog-tag') {
            let tags = this.state.selectedProg;
            this.setState({ selectedProg: this.spliceArray(tags, event.target.value) });
        } else if (event.target.name == 'tag-tag') {
            let tags = this.state.selectedTag;
            this.setState({ selectedTag: this.spliceArray(tags, event.target.value) });
        }
    }

    spliceArray(arr, value) {
        const tagIndex = arr.indexOf(value);
        if (tagIndex !== -1) {
            arr.splice(tagIndex, 1);
        }
        return arr;
    }

    render() {
        {/* Setup dropdown menus */}
        let langMenu = this.state.initialLang.map((lang) => <option key={lang}>{lang}</option>);
        let progMenu = this.state.initialProg.map((prog) => <option key={prog}>{prog}</option>);
        let tagMenu = this.state.initialTag.map((tag) => <option key={tag}>{tag}</option>);
        let courseMenu = this.state.courseList.map((course) => <option key={course['code']} value={course['code']}>{course['code'] + ' ' + course['name']}</option>);

        return (
            <div id="page-start">
                <div className="my-3 p-3 bg-white rounded shadow-sm">
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
                            projectService.create_group(title, max_people, this.state.course, this.state.description, this.state.selectedLang, this.state.selectedProg, this.state.selectedTag)
                                .then(
                                    user => {
                                        const curr_id = authenticationService.currentUserValue.uid;

                                        // const { from } = this.props.location.state || { from: { pathname: "/" } };
                                        // this.props.history.push(from);
                                        QB.createSession({ login: curr_id, password: curr_id }, (err, res) => {
                                            if (res) {
                                                QBcreateGroup({name: title, project_id: user.project_id})
                                                    .then(resp => {
                                                        window.location.reload();
                                                    });
                                            } else {
                                                console.log(err);
                                            }
                                        });
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
                                    <label htmlFor="course" className="pb-2 mb-0">Course</label>
                                    <select className="custom-select" data-dropup-auto="false" onChange={event => this.handleCourseChange(event)}>
                                        {courseMenu}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title" className="pb-2 mb-0">Number of members</label>
                                    <div className="form-group input-group">
                                        {/* <input type="text" id="title" className="form-control bg-dark rounded py-2" placeholder="Enter title" style={{ 'color': 'white' }} required></input> */}
                                        <Field name="max_people" type="number" id="max_people" min="1" className={'form-control'} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title" className="pb-2 mb-0">Languages</label>
                                    <select className="custom-select" data-dropup-auto="false" name="lang-menu" onChange={event => this.handleMenuChange(event)}>
                                        {langMenu}
                                    </select>
                                    {/* Show tags */}
                                    <div className="my-3 border-0 p-0 px-2">
                                        <i className="mr-4 text-muted"> Selected:</i>
                                        <span id="tags">
                                            {
                                                this.state.selectedLang.map((lang) => {
                                                    return (
                                                        <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={lang}>{lang}<button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={lang} style={{ 'outline': 'none' }} name="lang-tag" onClick={this.removeTag.bind(this)}></button></span>
                                                    );
                                                })}
                                            <br />

                                        </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title" className="pb-2 mb-0">Programming Languages</label>
                                    <select className="custom-select" data-dropup-auto="false" name="prog-menu" onChange={event => this.handleMenuChange(event)}>
                                        {progMenu}
                                    </select>
                                    {/* Show tags */}
                                    <div className="my-3 border-0 p-0 px-2">
                                        <i className="mr-4 text-muted"> Selected:</i>
                                        <span id="tags">
                                            {
                                                this.state.selectedProg.map((prog) => {
                                                    return (
                                                        <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={prog}>{prog}<button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={prog} style={{ 'outline': 'none' }} name="prog-tag" onClick={this.removeTag.bind(this)}></button></span>
                                                    );
                                                })}
                                            <br />

                                        </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title" className="pb-2 mb-0">Tags</label>
                                    <select className="custom-select" data-dropup-auto="false" name="tag-menu" onChange={event => this.handleMenuChange(event)}>
                                        {tagMenu}
                                    </select>
                                    {/* Show tags */}
                                    <div className="my-3 border-0 p-0 px-2">
                                        <i className="mr-4 text-muted"> Selected:</i>
                                        <span id="tags">
                                            {
                                                this.state.selectedTag.map((tag) => {
                                                    return (
                                                        <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={tag}>{tag}<button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={tag} style={{ 'outline': 'none' }} name="tag-tag" onClick={this.removeTag.bind(this)}></button></span>
                                                    );
                                                })}
                                            <br />

                                        </span>
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