import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import peopleIcon from '@/Assert/peopleIcon.png';
import '@/Style';
import { SkillBox,GroupCard,GroupPage } from '@/WebComponents';
import { userService } from '@/_services';

class MyGroup extends React.Component {
    constructor(props) {
        super(props);
        this.changeCurrentProject = this.changeCurrentProject.bind(this);
        this.state = {
            "_id":"??",
            hasLoaded: false,
            projectData:[],
            currentProject: null
            // isEditing: false
        };
    }

    componentDidMount() {
        console.log("========componentDidMount")
        if (!this.state.hasLoaded && this.props._id) {
            userService.getUserProject(this.props._id).then(data => {
                this.setState({ 
                    _id:"-----",
                    hasLoaded: true,
                    projectData: data
                });
                if (data.length > 0) {
                    userService.getProjectDetail(data[0].project_id).then(projectData => {
                        this.setState({ 
                            currentProject:projectData
                        });
                    });
                }
        })}
    }

    changeCurrentProject(project_id) {
        userService.getProjectDetail(project_id).then(projectData => {
            this.setState({ 
                currentProject:projectData
            });
        });
    }
    render() {
        let key_id=0;
        let id_value=0;
        let current_project=this.state.projectData[0];
    	return(
            <div class="container-fluid">
				<div class="row mt-1">
					<div class="col-sm-9 pl-1">
                        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 class="h4 ml-2">My Group</h1>
                            <button type="button" class="btn btn-sm btn-outline-secondary">Edit Group</button>
                        </div>
                        {this.state.currentProject &&
                        <div class="my-3 p-3 bg-white rounded shadow-sm">
                            <GroupPage data={this.state.currentProject} key_id_outer={key_id}/>
                        </div>
                        }
					</div>
                    {/* My Group List*/}
                    <div class="col-sm-3 pl-0">
                        <div class="ml-0 mr-auto">
                            {
                            (this.state.projectData || []).map((item) => {
                                return(
                                        <div value={item.project_id} onClick={this.changeCurrentProject.bind(this,item.project_id)}>
                                           <GroupCard   key={key_id++}
                                                        href="javascript:void(0)"
                                                        title={item.title}
                                                        current_number={item.cur_people}
                                                        max_number={item.max_people}
                                                        description={item.description}
                                                        />
                                        </div>
                                        )
                                })
                            }
                        </div>
                    </div>

				</div>
			</div>
		);
    }

}

export { MyGroup };