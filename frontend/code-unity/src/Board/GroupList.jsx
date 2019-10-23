import React from 'react';


class GroupList extends React.Component {
	// constructor(props) {
 //        super(props);
 //    }


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
                    <div class="media text-muted pt-3">
                      <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                      <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                        <div class="d-flex justify-content-between align-items-center w-100">
                          <strong class="text-gray-dark">Cook weeeebsite</strong>
                          <a href="#">Join</a>
                        </div>
                        <span class="d-block">we are recruting!!! If you are looking for a project about cook web development. Join us right now!!! </span>
                      </div>
                    </div>
                    <div class="media text-muted pt-3">
                      <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                      <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                        <div class="d-flex justify-content-between align-items-center w-100">
                          <strong class="text-gray-dark">Hackking project</strong>
                          <a href="#">Join</a>
                        </div>
                        <span class="d-block">we are looking for members who are interested about hacking website.</span>
                      </div>
                    </div>
                    <div class="media text-muted pt-3">
                      <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                      <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                        <div class="d-flex justify-content-between align-items-center w-100">
                          <strong class="text-gray-dark">Comp2511 Project group recruiting</strong>
                          <a href="#">Join</a>
                        </div>
                        <span class="d-block">Join us if your are looking for higher mark in this project.</span>
                      </div>
                    </div>
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