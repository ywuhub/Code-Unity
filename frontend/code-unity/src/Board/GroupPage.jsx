import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import '@/Style';
import { SkillBox, GroupCard } from '@/WebComponents';
import { userService } from '@/_services';

class GroupPage extends React.Component {
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
        userService.getProjectDetail(_id).then(data => {
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
        let key_id = 0;
        return (
            <div class="container">
                <div class="row border-bottom border-gray">
                    <h1 class=" pb-3 pt-3 mb-0 h4">My Groups</h1>
                </div>
                <div class="row mt-1">
                    <div class="col-sm-9 pl-1">
                        <div class="my-3 p-3 bg-white rounded shadow-sm">
                            <div class="container pl-4">
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                    <h4 class="h1">{this.state.details.title}</h4>
                                    <div className="btn-toolbar mb-2 mb-md-0">
                                        <div className="btn-group mr-2">
                                            <button type="button" className="btn btn-sm btn-outline-secondary">Join Group</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mt-4 border-bottom border-grey">
                                    <div class="col-9">
                                        <div class="row">
                                            <p>Leader: </p>
                                            <p>{this.state.details.leader}</p>
                                        </div>
                                        <div class="row">
                                            <p>Member: </p>
                                            <p>{this.state.details.members && Array.from(this.state.details.members).join(', ')}</p>
                                        </div>
                                    </div>
                                    <div class="col-3 group-page-member-setting text-left">
                                        <div class="row">
                                            <p class="d-block text-gray-dark"> Member number:</p>
                                            <p class="d-block text-gray-dark">{this.state.details.cur_people}</p>
                                        </div>
                                        <div class="row">
                                            <p class="d-block text-gray-dark">max: </p>
                                            <p class="d-block text-gray-dark">{this.state.details.max_people}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="row mt-4 border-bottom border-grey">
                                    <div class="col-12">
                                        <h6 class="row h6">About This Group</h6>
                                        <p class="row pt-2">{this.state.details.description}</p>
                                    </div>
                                </div>
                                {this.state.details.course &&
                                    <div class="row mt-3 border-bottom border-grey">
                                        <div class="col-12 row">
                                            <p>Courses:</p>
                                            <p>{this.state.details.course}</p>
                                        </div>
                                    </div>
                                }
                                <div class="row container pt-3 pl-0">
                                    <SkillBox keyValue={key_id++} title="technologies" data={( this.state.details.technologies)} />
                                    <SkillBox keyValue={key_id++} title="languages" data={( this.state.details.languages)} />
                                    <SkillBox keyValue={key_id++} title="tags" data={( this.state.details.tags)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export { GroupPage };