import React from 'react';
import { SkillBox } from '@/WebComponents';
import { Route, Link, Switch } from 'react-router-dom';
import { authenticationService, projectService } from '@/_services';

import '@/Style';

class GroupPage extends React.Component {

    constructor(props) {
        super(props);
    }
    leaveProject(e) {
        projectService.leave_group(this.props.datag.project_id)
            .then(json => {
                console.log(json);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    render() {
        let key_id = this.props.key_id_outer;
        let leader = this.props.data.leader;
        let members = this.props.data.members;
        const curr_id = authenticationService.currentUserValue.uid;
        return (
                <div>
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h4 ml-2">My Group</h1>
                        <div>
                        {
                            <button type="button" className="btn btn-sm btn-outline-secondary mx-1" 
                                onClick={this.leaveProject.bind(this)}>
                                {(this.props.isEditable && "Delete") || "Leave"} 
                                Group
                            </button> 
                        }
                        {this.props.isEditable&&
                            <a href={"/mygroup/edit/"+this.props.data.project_id}>
                                <button type="button" className="btn btn-sm btn-outline-secondary">Edit Group</button>
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
                                    {(curr_id === leader._id && <Link to='/profile' style={{ 'textDecoration': 'none' }}>{leader.username}</Link>) ||
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
                                                    {(curr_id === member._id && <Link to='/profile' style={{ 'textDecoration': 'none' }}>{member.username}</Link>) ||
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
            </div>
        );
    }
};
export { GroupPage };
