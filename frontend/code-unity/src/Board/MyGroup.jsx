import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import peopleIcon from '@/Assert/peopleIcon.png';
import UserIcon from '@/Assert/catSelfie.png';
import '@/Style';

class MyGroup extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {

    	const GroupComponent = (props) => (
    			<div class="my-3 p-3  bg-white rounded shadow-sm">
            		<div className="row mr-1">
            			<strong class="d-block text-gray-dark ml-4">{props.title}</strong>
            		</div>
    	     		<div className="row group-card-member-text mt-1 mb-1">
            			<span className="ml-4"> </span>
            			<p class="d-block text-gray-dark">{props.current_number}</p>
            			<p class="d-block text-gray-dark  ml-2"> Members</p>
            			<p class="d-block text-gray-dark ml-5">max: </p>
            			<p class="d-block text-gray-dark ml-2">{props.current_number}</p>
      					{/*<img src={peopleIcon} className="icon-setting"/>*/}
        			</div>
        			<div className="row group-card-row-text avatar-div-setting">
            			<span className="ml-4"> </span>
      					<img src={UserIcon} className="avatar rounded-circle"/>
      					<img src={UserIcon} className="avatar rounded-circle"/>
      					<img src={UserIcon} className="avatar rounded-circle"/>
        			</div>
        			<div className="row group-card-row-text ">
            			<p class="d-block text-gray-dark ml-4 mt-2">{props.description}</p>
      					{/*<img src={peopleIcon} className="icon-setting"/>*/}
        			</div>
        		</div>
    		);
        const GroupSkillBox = (props) => (
                <div class="col mr-2 group-page-box">
                    <div class="row group-page-box-header">
                        <h1 class="h6 mt-2 ml-3 mb-2">{props.title}</h1>
                    </div>
                    <div>
                        {
                            (props.data || []).map((item) => {
                                return(
                                    <span className="badge badge-pill badge-info mr-2 mt-1 pl-2 pr-2" key={props.item + ' '}>
                                        {item}
                                    </span>
                                    )
                            })
                        }
                    </div>
                </div>
            );
    	return(
            <div class="container">
                <div class="row border-bottom border-gray">
                    <h1 class=" pb-3 pt-3 mb-0 h4">My Groups</h1>
                </div>
				<div class="row mt-1">
					{/* My Group List*/}
					<div class="col-sm-3 pl-0">
                    	<div class="ml-0 mr-auto">
                  			<GroupComponent title="Comp4920 Project"
                                            current_number="5"
                                             description="we are looking for 2 frontend guys."/>
                    	   <GroupComponent title="Comp4920 Project"
                                            current_number="5"
                                             description="we are looking for 2 frontend guys."/>
                        

                        </div>
					</div>
					<div class="col-sm-9 pl-1">
                        <div class="my-3 p-3 bg-white rounded shadow-sm">
                            <div class="container pl-4">
                                <div class="row mt-2">
                                    <h4 class="h1"> Title</h4>
                                </div>
                                <div class="row mt-4 border-bottom border-grey">
                                    <div class="col-9">
                                        <div class="row">
                                            <p>Leader: </p>
                                            <p>somebody</p>
                                        </div>
                                        <div class="row">
                                            <p>Member: </p>
                                            <p>somebody</p>
                                        </div>
                                    </div>
                                    <div class="col-3 group-page-member-setting text-left">
                                        <div class="row">
                                            <p class="d-block text-gray-dark"> Member number:</p>
                                            <p class="d-block text-gray-dark">5 </p>
                                        </div>
                                        <div class="row">
                                            <p class="d-block text-gray-dark">max: </p>
                                            <p class="d-block text-gray-dark">5</p>
                                        </div>
                                    </div>
                                </div>
    
                                <div class="row mt-4 border-bottom border-grey">
                                    <div class="col-12">
                                        <h6 class="row h6">About This Group</h6>
                                        <p class="row pt-2">some descriptions</p>
                                    </div>
                                </div>
                                <div class="row mt-3 border-bottom border-grey">
                                    <div class="col-12 row">
                                        <p>Courses:</p>
                                        <p>Comp4920</p>

                                    </div>
                                </div>
                                <div class="row container pt-3 pl-0">
                                    <GroupSkillBox title="technologies" data={ ["hiking","watching the world cup","programming"] }/>
                                    <GroupSkillBox title="languages" data={ ["hiking","watching the world cup","programming"] }/>
                                    <GroupSkillBox title="tags" data={ ["hiking","watching the world cup","programming"] }/>

                                </div>
                            </div>
                        </div>
					</div>
				</div>
			</div>
		);
    }

}

export { MyGroup };