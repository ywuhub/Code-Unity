import React from 'react';

import { Notification } from '@/WebComponents';

class Dashboard extends React.Component {
	// constructor(props) {
 //        super(props);
 //    }

    addNotification() {

    }
    render() {
        return (
            // const data = [{"title":"Group Message","content":"You are successfully join group "Hackking project""},
            //                 {"title":"Jessica"," Do you want have a dinner with me?"},
            //                 {"title":"Invitation","Allen invites you to join group "web development"."}];
            <div class="my-3 p-3 bg-white rounded shadow-sm">
                <h6 class="border-bottom border-gray pb-2 mb-0">Notifications</h6>
               {/* <div class="media text-muted pt-3">
                  <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                  <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                    <strong class="d-block text-gray-dark">Group Message</strong>
                        You are successfully join group "Hackking project".
                  </p>
                </div>
                <div class="media text-muted pt-3">
                  <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                  <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                    <strong class="d-block text-gray-dark">Jessica</strong>
                        Do you want have a dinner with me?
                  </p>
                </div>
                <div class="media text-muted pt-3">
                  <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#6f42c1"></rect><text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text></svg>
                  <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                    <strong class="d-block text-gray-dark">Invitation</strong>
                        Allen invites you to join group "web development"
                  </p>
                </div>*/}
                <Notification title={"jessica"} content={"Do you want have a dinner with me?"}/>
                <Notification title={"Invitation"} content={'somebody" invite you to group "hello world".'}/>
                <small class="d-block text-right mt-3">
                  <a href="#">All Notifications</a>
                </small>
            </div>
        );
    }

}

export { Dashboard };