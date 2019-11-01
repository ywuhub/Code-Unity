import React from 'react';


class GroupChat extends React.Component {
	// constructor(props) {
 //        super(props);
 //    }


    render() {
        return (
            <div class="row">
              {/*left bar*/}                 
              <div class="sidebar-sticky col-md-3" className="contact-bar-outline">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 class="h4">Group Chat</h1>
                </div>
                  <ul class="nav flex-column">
                    <a href="#" className="contact-bar-item-selected">
                      <li class="nav-item" >
                        <a class="nav-link active">Project: Comp4920</a>
                      </li>
                    </a>
                    <a href="#" className="contact-bar-item">
                      <li class="nav-item">
                        <a class="nav-link">Project: Web Development Crew</a>
                      </li>
                    </a>
                    <a href="#" className="contact-bar-item">
                      <li class="nav-item">
                        <a class="nav-link" >Project: Hackathon</a>
                      </li>
                    </a>
                    <a href="#" className="contact-bar-item">
                      <li class="nav-item">
                        <a class="nav-link" >Project: COMP2511</a>
                      </li>
                    </a>
                  </ul>
              </div>
              {/*Message page*/}
              <div class="col-md-6">
                <div >
                <p>Discussion Page</p>
                </div>
              </div>
            </div>
        );
    }

}

export { GroupChat };