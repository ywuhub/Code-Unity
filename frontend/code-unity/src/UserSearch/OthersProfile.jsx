import React from 'react';
import { SkillBox } from '@/WebComponents';
import { userService } from '@/_services';

class OthersProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            username: '',
            email: '',
            github: '',
            tmp: '',
            interests: ["blah", "blah"],
            programming_languages: ["boo"],
            languages: ["lah"],
            isLoading: false
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        const { _id, username } = this.props.location.state;
        userService.getUserProfile(_id).then(data => {
            this.setState({
                id_: _id,
                username: username,
                tmp: data,
                isLoading: false
            })
        });
    }

    render() {
        return (
            <div className="container-fluid">
                {(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>) ||
                    <div>
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h4">{this.state.username} Profile</h1>

                            <div className="btn-group">
                                <button className="btn btn-primary border rounded">
                                    <i class="fas fa-user-plus"></i> Invite to group
                                </button>
                                <button className="btn btn-primary border rounded">
                                    <i class="fas fa-envelope"></i>
                                </button>
                            </div>
                            {/* <div className="nav nav-tabs btn-group mr-2" role="tablist"> */}
                                {/* <button type="button" className="btn btn-sm btn-outline-secondary nav-item active" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button> */}
                                {/* <button type="button" className="btn btn-sm btn-outline-secondary nav-item" data-toggle="tab" href="#nav-edit" role="tab" aria-controls="nav-edit" aria-selected="false">Edit Profile</button> */}
                            {/* </div> */}
                        </div>
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id="nav-profile">
                                <div className="my-3 p-3 bg-white rounded shadow-sm">
                                    <div className="m-4">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <img src="https://api.adorable.io/avatars/200/avatar.png" className="mx-auto img-fluid img-circle d-block rounded-circle" alt="avatar" />
                                            </div>
                                            <div className="col-md-6 align-middle">
                                                <div>
                                                    <p> Username: {this.state.username} </p>
                                                </div>
                                                <div>
                                                    <p> Email: {this.state.email} </p>
                                                </div>
                                                <div>
                                                    <p> Github Portfolio: <a href={'https:\\' + this.state.github} target="_blank"> {this.state.github} </a> </p>
                                                </div>
                                            </div>
                                            <div className="editable-alias">&nbsp;</div>

                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col mr-3 mt-3 group-page-box">
                                                        <div className="row group-page-box-header">
                                                            <h1 className="h6 mt-2 ml-3 mb-2">About Me:</h1>
                                                        </div>
                                                        <div>
                                                            <p> {this.state.tmp} </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    <SkillBox title="Interests" data={this.state.interests} />
                                                    <SkillBox title="Programming languages" data={this.state.programming_languages} />
                                                    <SkillBox title="Languages Spoken" data={this.state.languages} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export { OthersProfile };