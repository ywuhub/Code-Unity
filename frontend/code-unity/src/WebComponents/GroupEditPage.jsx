import React from 'react';
import { SkillBox } from '@/WebComponents';
import '@/Style';
import { userService, projectService, authenticationService } from '@/_services';
import { QBupdateGroupName, QBremoveMembers, QBgetUser } from '@/QuickBlox';

class GroupEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.curr_id = authenticationService.currentUserValue.uid;
        this.removeTag = this.removeTag.bind(this);
        this.addTag = this.addTag.bind(this);
        this.putProjectDetails = this.putProjectDetails.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.removeMembers = this.removeMembers.bind(this);
        this.kickMember = this.kickMember.bind(this);
        this.state = {
            "project_id": "",
            title: "",
            leader: "",
            cur_people: "",
            max_people: "",
            members: [],
            description: "",
            course:"",
            tags: [],
            languages: [],
            technologies: [],
            edit_status_visibility: false,
            edit_status_class: "",
            edit_status: "",
            kickMember: "",
            isSubmitting: false
        };

    }
    componentDidMount() {
        console.log("========componentDidMount")
        console.log(this.props)
        this.setState({ 
            "project_id": this.props.data.project_id,
            title: this.props.data.title,
            leader: this.props.data.leader,
            cur_people: this.props.data.cur_people,
            max_people: this.props.data.max_people,
            members: this.props.data.members,
            description: this.props.data.description,
            course:this.props.data.course,
            tags: this.props.data.tags,
            languages: this.props.data.languages,
            technologies: this.props.data.technologies
        });

    }

    removeTag(e) {
        e.preventDefault();
        if (e.detail != 0) {
            if (e.target.classList.contains('tags')) {
              let tags = this.state.tags;
              const tagIndex = tags.indexOf(e.target.value);
              if (tagIndex !== -1) {
                tags.splice(tagIndex, 1);
                this.setState({ tags: tags });
            }

            } else if (e.target.classList.contains('languages')) {
              let tags = this.state.languages;
              const tagIndex = tags.indexOf(e.target.value);
              if (tagIndex !== -1) {
                tags.splice(tagIndex, 1);
                this.setState({ languages: tags });
                }
            } else if (e.target.classList.contains('technologies')) {
              let tags = this.state.technologies;
              const tagIndex = tags.indexOf(e.target.value);
              if (tagIndex !== -1) {
                tags.splice(tagIndex, 1);
                this.setState({ technologies: tags });
                }
            }
        }
    }


    addTag(e) {

        if (e.key === 'Enter') {
            if (e.target.classList.contains('tags')) {
              let tags = (this.state.tags || []);
              const newTag = e.target.value;
              tags.push(newTag);
              this.setState({ tags: tags });

            } else if (e.target.classList.contains('languages')) {
              let tags = (this.state.languages || []);
              const newTag = e.target.value;
              tags.push(newTag);
              this.setState({ languages: tags });
            } else if (e.target.classList.contains('technologies')) {
              let tags = (this.state.technologies || []);
              const newTag = e.target.value;
              tags.push(newTag);
              this.setState({ technologies: tags });
            }
        }
    }
    putProjectDetails(e) {
        e.preventDefault();
        if (e.detail != 0) {
            event.preventDefault();
            userService.putProjectDetail(
                this.state.project_id,
                this.refs.edit_title.value,
                this.refs.edit_max_people.value,
                this.refs.edit_description.value,
                this.refs.edit_course.value,
                this.state.tags,
                this.state.languages,
                this.state.technologies,
            ).then(
                status => {
                    this.setState({ edit_status_visibility: true, isSubmitting: true })
                    var project_id = this.state.project_id;
                    var newName = this.refs.edit_title.value;
                    var setSubmitting = () => { this.setState({ isSubmitting: false }) }
                    if (status == "OK") {
                        this.setState({
                            edit_status_class:"alert alert-success",
                            edit_status:"Profile has been updated."});
                            
                        QB.createSession({ login: this.curr_id, password: this.curr_id }, function (err, result) {
                            if (result) {
                                QBupdateGroupName(project_id, {name: newName, project_id: project_id})
                                    .then(resp => { setSubmitting() });
                            }
                        });

                    } else {
                        this.setState({
                            edit_status_class:"alert alert-danger",
                            edit_status:status});
                    }
                }
            );            
        }
    }
    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
          event.preventDefault();
        }
    }

    leaveProject(e) {
        projectService.leave_group(this.state.currentProject.project_id)
            .then(json => {
                console.log(json);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    kickMember(member) {
        this.setState({ kickMember: member})
    }

    removeMembers() {
        this.setState({ isSubmitting: true });
        var project_id = this.state.project_id;
        var member_id = this.state.kickMember._id;
        projectService.kick_member(this.state.project_id, this.state.kickMember._id)
            .then(json => {
                console.log(json);
                QB.createSession({ login: this.curr_id, password: this.curr_id }, function (err, result) {
                    if (result) {
                        let member = [];
                        QBgetUser(member_id)
                            .then(user => {
                                member.push(user.id);
                                QBremoveMembers(project_id, member);
                            })
                    }
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        let key_id = this.props.key_id_outer;
        let member_id = 0;
        const EditSkillBox = (props) => {
            // let badge_key = props.keyValue * 20;
            let badge_key = 0;
            return(
                <div key={badge_key++} className="col mr-2 mt-2 group-page-box">
                    <div className="row group-page-box-header">
                        <h1 className="h6 mt-2 ml-3 mb-2">{props.title}</h1>
                    </div>
                    <div>
                        {
                            (props.data || []).map((item) => {
                                return(
                                        <span className="badge badge-pill badge-info profile-tag-container mt-1 mb-1 mr-2" key={badge_key++}>
                                            {item}
                                            <button className={["fa fa-times bg-transparent border-0 p-0 pl-1", props.className].join(' ')}
                                                    value={item} 
                                                    style={{ 'outline': 'none' }} 
                                                    onClick={this.removeTag}>
                                            </button>
                                        </span>
                                    )
                            })
                        }
                    </div>
                    <span className="badge badge-pill badge-primary mr-1  mt-1 mb-1 profile-tag-container" >
                            <input type="text" 
                            placeholder="add new tag" 
                            className={["group-edit-tag-input", props.className].join(' ')} 
                            onKeyDown={this.addTag}/>

                    </span>

                </div>
            );
        };

        return(
                <form role="form" onSubmit={this.putProjectDetails} onKeyPress={this.onKeyPress}>
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h4 ml-2">My Group</h1>
     
                        <div className="col-lg-9 btn-toolbar  justify-content-end">
                            {this.state.isSubmitting &&
                                <div className="mr-3"><img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" /></div>
                            }
                            <a className="btn btn-secondary btn-sm mr-2 nav-item" href={!this.state.isSubmitting && "/mygroup"}>
                             Cancel 
                             </a>
                            <button type="submit" 
                            className="btn btn-primary btn-sm"
                            disabled={this.state.isSubmitting}
                            > Save Changes </button>
                        </div>
                    </div>
                    {
                        this.state.edit_status_visibility&&
                        <div className={this.state.edit_status_class} role="alert">
                            {this.state.edit_status}
                        </div>
                    }
                    <div className="my-3 p-3 bg-white rounded shadow-sm">
                        <div className="container-fluid pl-4">
                            <div className="row mt-2 d-flex justify-content-between flex-wrap">
                                <input 
                                    className="form-control form-control-lg title-setting border-dashed" 
                                    type="text" 
                                    ref="edit_title"
                                    defaultValue={this.props.data.title}/>
                            </div>
                            <div className="row mt-4 border-bottom border-grey">
                                <div className="col-9">
                                    <div className="row">
                                        <p>Leader: </p>
                                        <p>{this.props.data.leader.username}</p>
                                    </div>
                                    <div className="row">
                                        <p>Member: </p>
                                    </div>
                                        {
                                           (this.props.data.members || []).filter((member) => { return member.username !== this.props.data.leader.username }).map((member) => {
                                            return(
                                                <div key={key_id++} className="row ml-1">
                                                    <p><a onClick={() => { this.kickMember(member) }} data-toggle="modal" data-target="#kick"><i className="fas fa-minus-square" style={{ color: 'red' }}></i></a>&nbsp;&nbsp;{member.username}</p>
                                                </div>
                                                )
                                            }) 
                                        }
                                </div>
                                <div className="col-3 group-page-member-setting text-left">
                                    <div className="row">
                                        <p className="d-block text-gray-dark"> Member number:</p>
                                        <p className="d-block text-gray-dark">{this.props.data.cur_people}</p>
                                    </div>
                                    <div className="row">
                                        <p className="d-block text-gray-dark">max: </p>
                                        <input 
                                            className="form-control form-control-lg border-1 max-number-setting border-dashed"  
                                            type="number" 
                                            min="1" 
                                            ref="edit_max_people"
                                            defaultValue={this.props.data.max_people}/>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-12">
                                    <h6 className="row h6">About This Group</h6>
                                </div>
                                <textarea className="form-control pl-1 border-dashed"
                                          ref="edit_description"
                                          defaultValue={this.props.data.description}></textarea>
                            </div>
                            {
                            <div className="row mt-3 border-bottom border-grey">
                                <div className="col-12 row">
                                    <p>Courses:</p>
                                    <input className="ml-1 form-control form-control-lg border-1 course-setting border-dashed" 
                                           type="text" 
                                           ref="edit_course"
                                           defaultValue={this.props.data.course}/>
                                </div>
                            </div>
                            }
                            <div className="row container pt-3 pl-0">
                                <EditSkillBox 
                                    keyValue={key_id++} 
                                    title="tags" 
                                    className="tags" 
                                    data={ this.props.data.tags }/>
                                <EditSkillBox 
                                    keyValue={key_id++} 
                                    title="technologies" 
                                    className="technologies" 
                                    data={this.props.data.technologies }/>
                                <EditSkillBox 
                                    keyValue={key_id++} 
                                    title="languages" 
                                    className="languages" 
                                    data={ this.props.data.languages }/>
                            </div>
                        </div>
                    </div>

                    {/* Confirm kick popup */}
                    <div className="modal fade" id="kick" tabIndex="-1" role="dialog" aria-labelledby="kickTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="kickTitle">Kick Member</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                    <label htmlFor="title" className="pb-2 mb-0">Are you sure you want to kick <b>{this.state.kickMember.username}?</b></label>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" onClick={() => { this.removeMembers() }} className="btn btn-primary" data-dismiss="modal">Kick</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
        );
    }

};
export { GroupEditPage };
