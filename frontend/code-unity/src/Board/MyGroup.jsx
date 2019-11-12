import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import peopleIcon from '@/Assert/peopleIcon.png';
import '@/Style';
import { SkillBox, GroupCard, GroupPage, GroupEditPage} from '@/WebComponents';
import { userService } from '@/_services';

class MyGroup extends React.Component {
    constructor(props) {
        super(props);
        this.changeCurrentProject = this.changeCurrentProject.bind(this);
        this.hasLoaded = false;
        this.state = {
            "_id":"??",
            projectData:[],
            currentProject: null,
            isLoading: false,
            isRedirect: false,
            isEdit: false
            // isEditing: false
        };
    }

    componentDidMount() {
        this.hasLoaded = true;
        console.log("========componentDidMount")
        // console.log(this.props)
        if (this.props._id) {
            this.setState({ isLoading: true });
            userService.getUserProject(this.props._id).then(data => {
                if (this.hasLoaded) {
                    this.setState({ 
                        _id:"-----",
                        projectData: data,
                        currentProject: data[0],
                        isLoading: false
                    });
                }
            })
        }
    }
    componentDidUpdate(){
        console.log("========componentDidUpdate")

        if (this.props.match.params.project_id && this.hasLoaded && !this.state.isRedirect) {
            for (var i=0; i < this.state.projectData.length; i++) {
                if (this.state.projectData[i].project_id == this.props.match.params.project_id) {
                    this.setState({ 
                        currentProject: this.state.projectData[i],
                        isRedirect : true
                    });
                }
            } 
        }
    }

    componentWillUnmount() {
        this.hasLoaded = false;
    }

    changeCurrentProject(index) {
        if (!this.props.isEdit && this.hasLoaded) {
            const changeTo = this.state.projectData[index];
            this.setState({ 
                currentProject: changeTo
            });
        }
    }

    render() {
        let key_id=0;
        let id_value=0;
        let current_project=this.state.projectData[0];
    	return(
            <div className="container-fluid">
				<div className="row mt-1">
					<div className="col-sm-9 pl-1">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h4 ml-2">My Group</h1>
                            {
                                this.state.currentProject&&
                                (this.props._id==this.state.currentProject.leader._id)
                                &&<a href={"/mygroup/edit/"+this.state.currentProject.project_id}>
                                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit Group</button>
                                </a>
                            }
                        </div>
                        {this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>}
                        {!this.state.isLoading &&
                        this.state.currentProject && !this.props.isEdit &&
                        <div className="my-3 p-3 bg-white rounded shadow-sm">
                            <GroupPage data={this.state.currentProject} key_id_outer={key_id}/>
                        </div>
                        }
                        {!this.state.isLoading &&
                        this.state.currentProject && this.state.isRedirect&&this.props.isEdit&&
                        <div className="my-3 p-3 bg-white rounded shadow-sm">
                            <GroupEditPage data={this.state.currentProject} key_id_outer={key_id}/>
                        </div>
                        }

					</div>
                    {/* My Group List*/}
                    <div className="col-sm-3 pl-0">
                        <div className="ml-0 mr-auto">
                            {
                            (this.state.projectData || []).map((item, index) => {
                                return(
                                        <div key={item.project_id} value={item.project_id} onClick={this.changeCurrentProject.bind(this,index)}>
                                           <GroupCard   key={key_id++}
                                                        isAdmin={this.props._id == item.leader._id ? true:false}
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