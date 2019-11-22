import React from 'react';

import UserIcon from '@/Assets/catSelfie.png';
import '@/Style';
import { userService } from '@/_services';


class GroupCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData :[]
        }
    }
    componentDidMount() {
        var allMembers = [this.props.leader._id];

        for (var i = 0; i < this.props.members.length; i++) {
            if (this.props.leader._id != this.props.members[i]._id) {
                allMembers.push(this.props.members[i]._id);
            }
        }
        userService.getUserAvatars(allMembers).then(data => {
                this.setState({ userData: data });
            }
        );
    }
    render() {
        var avatar_key = this.props.keyValue+1;
        return(
            <div>
                <a href={this.props.address} className="text-decoration-none">
                    <div className="my-3 p-3  bg-white rounded shadow-sm group-card-box" key={this.props.keyValue}>
                        <div className="row mr-1 group-card-box-title">
                            <strong className="d-block text-gray-dark ml-4 ">{this.props.title}{this.props.isAdmin&&
                                <font color="#F1C40F">&nbsp;
                                <i className="fas fa-crown group-card-admin-icon"></i></font>
                            }</strong>
                            
                        </div>
                        <div className="row group-card-member-text mt-1 mb-1">
                            <span className="ml-4"> </span>
                            <p className="d-block text-gray-dark">{this.props.current_number}</p>
                            <p className="d-block text-gray-dark  ml-2"> Members</p>
                            <p className="d-block text-gray-dark ml-5">max: </p>
                            <p className="d-block text-gray-dark ml-2">{this.props.max_number}</p>
                            {/*<img src={peopleIcon} className="icon-setting"/>*/}
                        </div>
                        <div className="row group-card-row-text avatar-div-setting">
                            <span className="ml-4"> </span>
                            {this.state.userData&&
                                (this.state.userData || []).map((item) => {
                                    return(
                                        <div key={avatar_key++}>
                                            <img src={item.avatar} className="avatar rounded-circle"/>
                                        </div>
                                        )
                                })
                            }
                        </div>

                    </div>
                </a>
            </div>
            )
    }
}
export { GroupCard };
