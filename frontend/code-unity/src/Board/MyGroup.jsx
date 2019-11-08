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
            currentProject: null,
            isLoading: false
            // isEditing: false
        };
    }

    componentDidMount() {
        console.log("========componentDidMount")
        if (!this.state.hasLoaded && this.props._id) {
            this.setState({ isLoading: true });
            userService.getUserProject(this.props._id).then(data => {
                this.setState({ 
                    _id:"-----",
                    hasLoaded: true,
                    projectData: data,
                    currentProject: data[0],
                    isLoading: false
                });
            })
        }
    }

    changeCurrentProject(index) {
        const changeTo = this.state.projectData[index];
        this.setState({ 
            currentProject: changeTo
        });
    }

    render() {
        let key_id=0;
        let id_value=0;
        let current_project=this.state.projectData[0];
    	return(
            <div className="container">
                <div className="row border-bottom border-gray">
                    <h1 className=" pb-3 pt-3 mb-0 h4">My Groups</h1>
                </div>
                {(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>) || 
				<div className="row mt-1">
					{/* My Group List*/}
					<div className="col-sm-3 pl-0">
                    	<div className="ml-0 mr-auto">
                            {
                            (this.state.projectData || []).map((item, index) => {
                                return(
                                        <div key={item.project_id} value={item.project_id} onClick={this.changeCurrentProject.bind(this,index)}>
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
					<div className="col-sm-9 pl-1">
                        <div className="my-3 p-3 bg-white rounded shadow-sm">
                            <div className="container pl-4">
                                <div className="row mt-2">
                                    <h4 className="h1">{this.state.currentProject.title}</h4>
                                </div>
                                <div className="row mt-4 border-bottom border-grey">
                                    <div className="col-9">
                                        <div className="row">
                                            <p>Leader: </p>
                                            <p>{this.state.currentProject.leader}</p>
                                        </div>
                                        <div className="row">
                                            <p>Member: </p>
                                            <p>somebody</p>
                                        </div>
                                    </div>
                                    <div className="col-3 group-page-member-setting text-left">
                                        <div className="row">
                                            <p className="d-block text-gray-dark"> Member number:</p>
                                            <p className="d-block text-gray-dark">{this.state.currentProject.cur_people}</p>
                                        </div>
                                        <div className="row">
                                            <p className="d-block text-gray-dark">max: </p>
                                            <p className="d-block text-gray-dark">{this.state.currentProject.max_people}</p>
                                        </div>
                                    </div>
                                </div>
    
                                <div className="row mt-4 border-bottom border-grey">
                                    <div className="col-12">
                                        <h6 className="row h6">About This Group</h6>
                                        <p className="row pt-2">{this.state.currentProject.description}</p>
                                    </div>
                                </div>
                                {this.state.currentProject.course &&
                                <div className="row mt-3 border-bottom border-grey">
                                    <div className="col-12 row">
                                        <p>Courses:</p>
                                        <p>{this.state.currentProject.course}</p>
                                    </div>
                                </div>
                                }
                                <div className="row container pt-3 pl-0">
                                    <SkillBox keyValue={key_id++} title="technologies" data={ (this.state.currentProject.technologies) }/>
                                    <SkillBox keyValue={key_id++} title="languages" data={ (this.state.currentProject.languages) }/>
                                    <SkillBox keyValue={key_id++} title="tags" data={ (this.state.currentProject.tags) }/>
                                </div>
                            </div>
                        </div>
					</div>
                    }
				</div>
            }

			</div>
		);
    }

}

export { MyGroup };