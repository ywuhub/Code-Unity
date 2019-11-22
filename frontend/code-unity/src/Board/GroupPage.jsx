import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'formik';
import '@/Style';
import { SkillBox } from '@/WebComponents';
import { userService, authenticationService } from '@/_services';
import { projectService, favouriteService } from '../_services';

class GroupPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            _id: '',
            details: {},
            description: '',
            requests: {},
            favourites: {},
            submitted: false,
            isLoading: true
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        const { _id } = this.props.location.state;
        userService.getProjectDetail(_id).then(data => {
            this.setState({
                _id: _id,
                details: data,
                isLoading: false,
            })
        })
        
        projectService.join_requests().then(requests => {
            this.setState({
                requests: requests
            })
        })

        favouriteService.get_favourite(authenticationService.currentUserValue.uid).then(favs => {
            this.setState({
                favourites: favs.favourite_projects
            })
        })
    }

    handleChange(event) {
        this.setState({ description: event.target.value });
    }

    handleSubmit() {
        projectService.join_group(this.state._id, this.state.description);
        this.setState({ submitted: true });
    }

    addFav() {
        favouriteService.add_favourite(authenticationService.currentUserValue.uid, this.state._id).then(() => {
            window.alert("Added to favourites!");
            window.location.reload();
        });
    }

    removeFav() {
        favouriteService.remove_favourite(authenticationService.currentUserValue.uid, this.state._id).then(() => {
            window.alert("Removed from favourites!");
            window.location.reload();
        });
    }

    render() {
        let key_id = 0;
        let leader = this.state.details.leader;
        let is_member = false;
        for (var i in this.state.details.members) {
            if (this.state.details.members[i]._id == authenticationService.currentUserValue.uid) {
                is_member = true;
                break;
            }
        }
        let applied = false;
        for (var j in this.state.requests) {
            if (this.state.requests[j].project_id == this.state.details.project_id) {
                applied = true;
                break;
            }
        }
        let favourited = false;
        for (var f in this.state.favourites) {
            if (this.state.favourites[f].project_id == this.state.details.project_id) {
                favourited = true;
                break;
            }
        }
        const group_full = (this.state.details.cur_people === this.state.details.max_people);
        return (
            <div className="container-fluid">
                {this.state.submitted && <div><br></br><div className="alert alert-success" role="alert">
                    Join request submitted!
                </div></div>}
                <div className="row mt-1">
                    <div className="col-sm pl-1">
                        <div className="my-3 p-3 bg-white rounded shadow-sm">
                            <div className="container-fluid pl-4">
                                <div className="row mt-4 d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                    <h4 className="h1">{this.state.details.title}</h4>
                                    <div className="btn-toolbar mb-2 mb-md-0">
                                        <div className="btn-group mr-2">
                                            {(!favourited) && <i title="Favourite" onClick={() => { this.addFav() }} className="star">
                                                <i className="far fa-star fav-icon hollow"></i>
                                                <i className="fas fa-star fav-icon fill"></i>
                                            </i>}
                                            {(favourited) && <i title="Unfavourite" onClick={() => { this.removeFav() }} className="star">
                                                <i className="fas fa-star fav-icon hollow"></i>
                                                <i className="far fa-star fav-icon fill"></i>
                                            </i>}
                                            {applied && <button type="button" className="btn btn-sm btn-outline-secondary">Join Request Pending</button>}
                                            {(!this.state.submitted && !is_member && !applied && !group_full) && <button type="button" className="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#joinForm">Join Group</button>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-4 border-bottom border-grey">
                                    <div className="col-9">
                                        <div className="row">
                                            <p>Leader:&nbsp;</p>
                                            {!this.state.isLoading && <p><Link to={{ pathname: "/profile-" + leader.username, state: { _id: leader._id, username: leader.username } }} id={leader._id} style={{ 'textDecoration': 'none' }}>{leader.username}</Link></p>}
                                        </div>
                                        <div className="row">
                                            <p>Members:&nbsp;</p>
                                            {!this.state.isLoading && <p>
                                                {
                                                    this.state.details.members.filter((member) => { return member.username !== leader.username }).map((member, index) => {
                                                        return (
                                                            <span key={member._id}>
                                                                <Link to={{ pathname: "/profile-" + member.username, state: { _id: member._id, username: member.username } }} id={member._id} style={{ 'textDecoration': 'none' }}>{member.username}</Link>
                                                                {index !== this.state.details.members.length - 2 && <span>,&nbsp;</span>}
                                                            </span>
                                                        )
                                                    })
                                                }
                                            </p>}
                                        </div>
                                    </div>
                                    <div className="col-3 group-page-member-setting text-left">
                                        <div className="row">
                                            <p className="d-block text-gray-dark"> Member number:</p>
                                            <p className="d-block text-gray-dark">{this.state.details.cur_people}</p>
                                        </div>
                                        <div className="row">
                                            <p className="d-block text-gray-dark">max: </p>
                                            <p className="d-block text-gray-dark">{this.state.details.max_people}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-4 border-bottom border-grey">
                                    <div className="col-12">
                                        <h6 className="row h6">About This Group</h6>
                                        <p className="row pt-2">{this.state.details.description}</p>
                                    </div>
                                </div>
                                {this.state.details.course &&
                                    <div className="row mt-3 border-bottom border-grey">
                                        <div className="col-12 row">
                                            <p>Courses:</p>
                                            <p>{this.state.details.course}</p>
                                        </div>
                                    </div>
                                }
                                <div className="row container-fluid pt-3 pl-0">
                                    <SkillBox keyValue={key_id++} title="technologies" data={( this.state.details.technologies)} />
                                    <SkillBox keyValue={key_id++} title="languages" data={( this.state.details.languages)} />
                                    <SkillBox keyValue={key_id++} title="tags" data={( this.state.details.tags)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create group modal */}
                <div className="modal fade" id="joinForm" tabIndex="-1" role="dialog" aria-labelledby="joinFormTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="joinFormTitle">Join Group</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Form>
                                    <div className="form-group">
                                        <label htmlFor="title" className="pb-2 mb-0">Application Message:</label>
                                        <div className="form-group input-group">
                                            <textarea name="description" value={this.state.description} onChange={this.handleChange} type="text" id="description" rows="4" className={'form-control'} placeholder="Write a message" />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary" onClick={() => { this.handleSubmit() }} data-dismiss="modal">Submit</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div> {/* Create group modal end */}
            </div>
        );
    }

}

export { GroupPage };