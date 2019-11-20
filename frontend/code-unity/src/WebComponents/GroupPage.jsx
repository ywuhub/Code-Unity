import React from 'react';
import { SkillBox } from '@/WebComponents';
import { Route, Link, Switch } from 'react-router-dom';
import { authenticationService, projectService } from '@/_services';
import { QBdeleteGroup, QBleaveGroup, QBgetUser } from '@/QuickBlox';

import '@/Style';

class GroupPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false
        }
        this.curr_id = authenticationService.currentUserValue.uid;
    }

    leaveProject(e) {
        this.setState({ isSubmitting: true });
        projectService.leave_group(this.props.data.project_id)
            .then(json => {
                QB.createSession({ login: this.curr_id, password: this.curr_id }, (err, res) => {
                    if (res) {
                        QB.data.list("Project", { project_id: this.props.data.project_id }, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                if (this.props.isEditable) {
                                    if (result.items.length != 0) {
                                        QBdeleteGroup(result.items[0].chat_id, this.props.data.project_id);
                                    }

                                    // leave group
                                } else {
                                    QBgetUser(this.curr_id)
                                        .then(qb_user => {
                                            if (result.items.length != 0) {
                                                QBleaveGroup(result.items[0].chat_id, qb_user.id);
                                            }
                                        })
                                }
                            }
                        });
                    } else {
                        console.log(err);
                    }
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        let key_id = this.props.key_id_outer;
        let leader = this.props.data.leader;
        let members = this.props.data.members;
        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h4 ml-2">My Group</h1>
                    <div>
                        {this.state.isSubmitting &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        {
                            <button type="button" className="btn btn-sm btn-outline-secondary mx-1" data-toggle="modal" data-target="#leave" disabled={this.state.isSubmitting}>
                                {(this.props.isEditable && "Delete") || "Leave"} 
                                &nbsp;Group
                            </button>
                        }
                        {this.props.isEditable &&
                            <a href={"/mygroup/edit/" + this.props.data.project_id}>
                                <button type="button" className="btn btn-sm btn-outline-secondary" disabled={this.state.isSubmitting}>Edit Group</button>
                            </a>
                        }
                    </div>
                </div>
                <div className="container-fluid pl-4">
                    <div className="row mt-2 d-flex justify-content-between flex-wrap">
                        <h4 className="h1">{this.props.data.title}</h4>
                    </div>
                    <div className="row mt-4 border-bottom border-grey">
                        <div className="col-9">
                            <div className="row">
                                <p>Leader:&nbsp;</p>
                                <p>
                                    {(this.curr_id === leader._id && <Link to='/profile' style={{ 'textDecoration': 'none' }}>{leader.username}</Link>) ||
                                        <Link to={{ pathname: "/profile-" + leader.username, state: { _id: leader._id, username: leader.username } }} id={leader._id} style={{ 'textDecoration': 'none' }}>{leader.username}</Link>
                                    }
                                </p>
                            </div>
                            <div className="row">
                                <p>Members:&nbsp;</p>
                                <p>
                                    {
                                        members.filter((member) => { return member.username !== this.props.data.leader.username }).map((member, index) => {
                                            return (
                                                <span key={member._id}>
                                                    {(this.curr_id === member._id && <Link to='/profile' style={{ 'textDecoration': 'none' }}>{member.username}</Link>) ||
                                                        <Link to={{ pathname: "/profile-" + member.username, state: { _id: member._id, username: member.username } }} id={member._id} style={{ 'textDecoration': 'none' }}>{member.username}</Link>
                                                    }
                                                    {index !== members.length - 2 && <span>,&nbsp;</span>}
                                                </span>
                                            )
                                        })
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="col-3 group-page-member-setting text-left">
                            <div className="row">
                                <p className="d-block text-gray-dark"> Member number:</p>
                                <p className="d-block text-gray-dark">{this.props.data.cur_people}</p>
                            </div>
                            <div className="row">
                                <p className="d-block text-gray-dark">max: </p>
                                <p className="d-block text-gray-dark">{this.props.data.max_people}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4 border-bottom border-grey">
                        <div className="col-12">
                            <h6 className="row h6">About This Group</h6>
                            <p className="row pt-2">{this.props.data.description}</p>
                        </div>
                    </div>
                    {this.props.data.course &&
                        <div className="row mt-3 border-bottom border-grey">
                            <div className="col-12 row">
                                <p>Courses:</p>
                                <p>{this.props.data.course}</p>
                            </div>
                        </div>
                    }
                    <div className="row container pt-3 pl-0">
                        <SkillBox keyValue={key_id++} title="Programming languages" data={this.props.data.technologies} />
                        <SkillBox keyValue={key_id++} title="languages" data={this.props.data.languages} />
                        <SkillBox keyValue={key_id++} title="tags" data={this.props.data.tags} />
                    </div>
                </div>

                {/* Create alert modal */}
                <div className="modal fade" id="leave" tabIndex="-1" role="dialog" aria-labelledby="leaveTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="leaveTitle">Leave Group</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="title" className="pb-2 mb-0">Are you sure you want to leave this group?</label>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.leaveProject.bind(this)} data-dismiss="modal">Leave Group</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> {/* Create alert modal end */}
            </div>
        );
    }
};
export { GroupPage };
