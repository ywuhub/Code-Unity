import React from 'react';

import { InviteSentComponent, InviteReceivedComponent } from './InvitesComponent';
import { JoinRequestsSent, JoinRequestsReceived } from './JoinRequestsComponent';

class Inbox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="d-flex flex-column pt-3 pb-2 mb-2 ">
                    <h4 className="border-bottom pb-2">Inbox</h4>
                    <ul className="nav nav-tabs nav-justified mt-3" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href="#invites-sent">Invites Sent</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#invites-received">Invites Received</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#requests-sent">Join Requests Sent</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#requests-received">Join Requests Received</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#requests-received">Group Notifications</a>
                        </li>
                    </ul>
                </div>
                <div className="p-3 bg-white rounded shadow-sm">
                    <div className="tab-content">
                        <div id="invites-sent" className="container-fluid tab-pane active"><br />
                            <InviteSentComponent />
                        </div>
                        <div id="invites-received" className="container-fluid tab-pane fade"><br />
                            <InviteReceivedComponent />
                        </div>
                        <div id="requests-sent" className="container-fluid tab-pane fade"><br />
                            <JoinRequestsSent />
                        </div>
                        <div id="requests-received" className="container-fluid tab-pane fade"><br />
                            <JoinRequestsReceived />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export { Inbox };