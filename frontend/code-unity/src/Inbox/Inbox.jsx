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
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 border-bottom">
                    <h4>Inbox</h4>
                </div>
                <div className="p-3 bg-white rounded shadow-sm">
                    <div>
                        <InviteSentComponent />
                        <InviteReceivedComponent />
                        <JoinRequestsSent />
                        <JoinRequestsReceived />
                    </div>
                </div>
            </div>
        )
    }
}

export { Inbox };