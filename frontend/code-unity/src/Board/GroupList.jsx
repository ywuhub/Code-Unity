import React from 'react';

import { GroupListItem } from '@/WebComponents';
import { userService } from '@/_services';

class GroupList extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            "data":[]
        };
    }

    componentDidMount() {
        console.log("========componentWillReceiveProps")
        userService.getProjectList().then(data => this.setState(
            { 
                "data": data
            }
        ));

    }
    render() {
        return (
            <div>
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h4">Groups</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group mr-2">
                            <button type="button" class="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#exampleModalCenter">Create New Group</button>
                        </div>
                       {/* <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                           	<span data-feather="calendar"></span>
                                This week
                        </button>*/}
                    </div>
                </div>

                <div class="my-3 p-3 bg-white rounded shadow-sm">
                    {<h6 class="border-bottom border-gray pb-2 mb-0">Find a new Group</h6>

                }
                    {
                        this.state.data.map((item) => {
                            return(
                            <GroupListItem title={item.title} description={item.project_id} />
                            )
                        })                            
                    }

                    <small class="d-block text-right mt-3">
                      <a href="#">All Groups</a>
                    </small>
                  </div>

                  <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalCenterTitle">Create New Group</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <form>
                            <label for="message-text" class="col-form-label">Group Name:</label>
                            <div class="input-group input-group-sm mb-3">
                                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                            </div>
                            <div class="form-group">
                              <label for="message-text" class="col-form-label">Description:</label>
                              <textarea class="form-control" id="message-text"></textarea>
                            </div>
                          </form> 
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
          );
    }

}

export { GroupList };