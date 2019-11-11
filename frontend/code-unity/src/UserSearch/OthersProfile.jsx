import React from 'react';
import { SkillBox } from '@/WebComponents';
import { userService } from '@/_services';

class OthersProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            details: {},
            not_found: false,
            isLoading: false
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        const { _id } = this.props.location.state;
        userService.getUserProfile(_id).then(data => {
            this.setState({
                id_: _id,
                details: data,
                isLoading: false
            })
        })
        .catch(err => {
            this.setState({
                not_found: true,
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
                            <h1 className="h4">{this.state.details.username} Profile</h1>

                            <div className="btn-group">
                                <button className="btn btn-primary border rounded">
                                    <i className="fas fa-user-plus"></i> Invite to group
                                </button>
                                <button className="btn btn-primary border rounded">
                                    <i className="fas fa-envelope"></i>
                                </button>
                            </div>
                        </div>
                        {  (this.state.not_found && 
                            <div>
                                <h2>Profile Not Found!</h2>
                            </div>) ||
                            
                            // private profile pages
                            (this.state.details.visibility === 'private' &&
                            <div> 
                                <h2>{this.state.details.username}'s profile is private</h2> 
                            </div>) ||

                            // public profile pages
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
                                                        <p> Username: {this.state.details.username} </p>
                                                    </div>
                                                    <div>
                                                        <p> Email: {this.state.details.email} </p>
                                                    </div>
                                                    <div>
                                                        <p> Github Portfolio: <a href={'https:\\' + this.state.details.github} target="_blank"> {this.state.details.github} </a> </p>
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
                                                                <p> {this.state.details.description} </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-2">
                                                        <SkillBox title="Interests" data={this.state.details.interests} />
                                                        <SkillBox title="Programming languages" data={this.state.details.programming_languages} />
                                                        <SkillBox title="Languages Spoken" data={this.state.details.languages} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
}

export { OthersProfile };