import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import peopleIcon from '@/Assert/peopleIcon.png';
import '@/Style';
import { SkillBox,GroupCard } from '@/WebComponents';
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
            <div class="container">
                <div class="row border-bottom border-gray">
                    <h1 class=" pb-3 pt-3 mb-0 h4">My Groups</h1>
                </div>
				<div class="row mt-1">
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
                    {this.state.currentProject &&
					<div class="col-sm-9 pl-1">
                        <div class="my-3 p-3 bg-white rounded shadow-sm">
                            <div class="container pl-4">
                                <div class="row mt-2">
                                    <h4 class="h1">{this.state.currentProject.title}</h4>
                                </div>
                                <div class="row mt-4 border-bottom border-grey">
                                    <div class="col-9">
                                        <div class="row">
                                            <p>Leader: </p>
                                            <p>{this.state.currentProject.leader}</p>
                                        </div>
                                        <div class="row">
                                            <p>Member: </p>
                                            <p>somebody</p>
                                        </div>
                                    </div>
                                    <div class="col-3 group-page-member-setting text-left">
                                        <div class="row">
                                            <p class="d-block text-gray-dark"> Member number:</p>
                                            <p class="d-block text-gray-dark">{this.state.currentProject.cur_people}</p>
                                        </div>
                                        <div class="row">
                                            <p class="d-block text-gray-dark">max: </p>
                                            <p class="d-block text-gray-dark">{this.state.currentProject.max_people}</p>
                                        </div>
                                    </div>
                                </div>
    
                                <div class="row mt-4 border-bottom border-grey">
                                    <div class="col-12">
                                        <h6 class="row h6">About This Group</h6>
                                        <p class="row pt-2">{this.state.currentProject.description}</p>
                                    </div>
                                </div>
                                {this.state.currentProject.course &&
                                <div class="row mt-3 border-bottom border-grey">
                                    <div class="col-12 row">
                                        <p>Courses:</p>
                                        <p>{this.state.currentProject.course}</p>
                                    </div>
                                </div>
                                }
                                <div class="row container pt-3 pl-0">
                                    <SkillBox keyValue={key_id++} title="technologies" data={ ([]||this.state.currentProject.technologies) }/>
                                    <SkillBox keyValue={key_id++} title="languages" data={ ([]||this.state.currentProject.languages) }/>
                                    <SkillBox keyValue={key_id++} title="tags" data={ ([]||this.state.currentProject.tags) }/>
                                </div>
                            </div>
                        </div>
					</div>
                    }
				</div>
			</div>
		);
    }

}

export { MyGroup };