import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import peopleIcon from '@/Assert/peopleIcon.png';
import '@/Style';
import { SkillBox,GroupCard } from '@/WebComponents';

class MyGroup extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {

    	return(
            <div class="container">
                <div class="row border-bottom border-gray">
                    <h1 class=" pb-3 pt-3 mb-0 h4">My Groups</h1>
                </div>
				<div class="row mt-1">
					{/* My Group List*/}
					<div class="col-sm-3 pl-0">
                    	<div class="ml-0 mr-auto">
                  			<GroupCard title="Comp4920 Project"
                                            current_number="5"
                                             description="we are looking for 2 frontend guys."/>
                    	   <GroupCard title="Comp4920 Project"
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
                                    <SkillBox title="technologies" data={ ["hiking","watching the world cup","programming"] }/>
                                    <SkillBox title="languages" data={ ["hiking","watching the world cup","programming"] }/>
                                    <SkillBox title="tags" data={ ["hiking","watching the world cup","programming"] }/>

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