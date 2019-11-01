import React from 'react';

import { userService } from '@/_services';
import '@/Style';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.removeTag = this.removeTag.bind(this);
        this.addTag = this.addTag.bind(this);
        this.putProfile = this.putProfile.bind(this);
        this.state = {
            "_id": "",
            name: "",
            email: "",
            visibility: "",
            description: "",
            interests: [],
            programming_languages: [],
            languages:[],
            github: "",
            edit_status:"",
            edit_status_class:"",
            edit_status_visibility: false,
            // isEditing: false
        };

    }
    componentDidMount() {
        console.log("========componentWillReceiveProps")
        this.setState({ edit_status_visibility: false})
        userService.getProfile().then(data => this.setState(
            { 
                "_id": data._id,
                name: data.name,
                email: data.email,
                visibility: data.visibility,
                description: data.description,
                interests: data.interests,
                programming_languages: data.programming_languages,
                languages: data.languages,
                github: data.github
            }
        ));

    }

    removeTag(e) {
        e.preventDefault();
        if (e.detail != 0) {
            if (e.target.classList.contains('interests')) {
              let tags = this.state.interests;
              const tagIndex = tags.indexOf(e.target.value);
              if (tagIndex !== -1) {
                tags.splice(tagIndex, 1);
                this.setState({ interests: tags });
            }

            } else if (e.target.classList.contains('programming_languages')) {
              let tags = this.state.programming_languages;
              const tagIndex = tags.indexOf(e.target.value);
              if (tagIndex !== -1) {
                tags.splice(tagIndex, 1);
                this.setState({ programming_languages: tags });
                }
            } else if (e.target.classList.contains('languages')) {
              let tags = this.state.languages;
              const tagIndex = tags.indexOf(e.target.value);
              if (tagIndex !== -1) {
                tags.splice(tagIndex, 1);
                this.setState({ languages: tags });
                }
            }
        }
    }


    addTag(e) {

        if (e.key === 'Enter') {
            if (e.target.classList.contains('interests')) {
              let tags = (this.state.interests || []);
              const newTag = e.target.value;
              tags.push(newTag);
              this.setState({ interests: tags });

            } else if (e.target.classList.contains('programming_languages')) {
              let tags = (this.state.programming_languages || []);
              const newTag = e.target.value;
              tags.push(newTag);
              this.setState({ programming_languages: tags });
            } else if (e.target.classList.contains('languages')) {
              let tags = (this.state.languages || []);
              const newTag = e.target.value;
              tags.push(newTag);
              this.setState({ languages: tags });
            }
        }
    }
    putProfile(event) {
            event.preventDefault();
            userService.putProfile(
                    this.refs.edit_name.value,
                    this.refs.edit_email.value,
                    this.refs.edit_visibility.value,
                    this.refs.edit_description.value,
                    this.state.interests,
                    this.state.programming_languages,
                    this.state.languages,
                    this.refs.edit_github.value,
                ).then(
                    status => {
                        this.setState({ edit_status_visibility: true})
                        if (status == "OK") {
                            this.setState({
                                edit_status_class:"alert alert-success",
                                edit_status:"Profile has been updated."});

                        } else {
                            this.setState({
                                edit_status_class:"alert alert-danger",
                                edit_status:status});
                        }
                    }
                );
    }
    render() {
        let tag_id = 0;
        return (
            <div class="container">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h4">My Profile</h1>

                    <div class="nav nav-tabs btn-group mr-2" role="tablist">
                        <button type="button" class="btn btn-sm btn-outline-secondary nav-item active" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary nav-item" data-toggle="tab" href="#nav-edit" role="tab" aria-controls="nav-edit" aria-selected="false">Edit Profile</button>
                    </div>
                </div>
                    <div class="tab-content" id="nav-tabContent">
                        <div class="tab-pane fade show active" id ="nav-profile">
                            <div class="my-3 p-3 bg-white rounded shadow-sm">
                                <div class="col-lg-10 order-lg-2">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <img src="//placehold.it/200" class="mx-auto img-fluid img-circle d-block" alt="avatar" />                                        
                                        </div>
                                        <div class="col-md-6">
                                            <div> 
                                                <p> Name: {this.state.name} </p>
                                            </div>
                                            <div> 
                                                <p> Email: {this.state.email} </p>
                                            </div>
                                            <div>
                                            {
                                                <p>
                                                Github Portfolio: <a href={'https:\\' + this.state.github} target="_blank"> {this.state.github} </a>
                                                </p>
                                            }
                                            </div>
                                        </div>
                                        <div class="editable-alias">&nbsp;</div>

                                        <div class="col-md-12">
                                                <div> 
                                                    <h6 class="border-bottom border-gray pb-2 mb-0">About Me:</h6>
                                                    <p> {this.state.description} </p> 
                                                </div>
                                                <div class="editable-alias">&nbsp;</div>

                                                <div> 
                                                    <h6 class="border-bottom border-gray pb-2 mb-0">Interests:</h6>
                                                    <div class="profile-descrption-block">
                                                    {
                                                        (this.state.interests || []).map((item) => {
                                                            return(
                                                                    <a href="#" class="badge badge-dark badge-pill mr-2">{item}</a>
                                                                )
                                                        })                            
                                                    }
                                                    </div>
                                                </div>
                                                <div class="editable-alias">&nbsp;</div>
                                                <div>
                                                    <h6 class="border-bottom border-gray pb-2 mb-0">Programming languages:</h6>
                                                    <div class="profile-descrption-block">
                                                    {
                                                        (this.state.programming_languages || []).map((item) => {
                                                            return(
                                                                <a href="#" class="badge badge-dark badge-pill mr-2">{item}</a>
                                                                )
                                                        })                            
                                                    }
                                                    </div>
                                                </div>
                                                <div class="editable-alias">&nbsp;</div>
                                                <div>
                                                    <h6 class="border-bottom border-gray pb-2 mb-0">Languages Spoken:</h6>
                                                    <div class="profile-descrption-block">
                                                    {
                                                        (this.state.languages || []).map((item) => {
                                                            return(
                                                                <a href="#" class="badge badge-dark badge-pill mr-2">{item}</a>
                                                                )
                                                        })                            
                                                    }
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="nav-edit">
                            <div class="my-3 p-3 bg-white rounded shadow-sm">
                                {
                                this.state.edit_status_visibility 
                                    ?
                                    <div class={this.state.edit_status_class} role="alert">
                                        {this.state.edit_status}
                                    </div>
                                    :
                                    <div>
                                    </div>
                                }
                                <form role="form" onSubmit={this.putProfile}>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Username:</label>
                                        <div class="col-lg-9">
                                            <input class="form-control" type="text" defaultValue={this.state.name} ref="edit_name"/>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Email:</label>
                                        <div class="col-lg-9">
                                            <input class="form-control" type="email" defaultValue={this.state.email} ref="edit_email" />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Github Portfolio:</label>
                                        <div class="col-lg-9">
                                            <input class="form-control" type="text" defaultValue={this.state.github} ref="edit_github"/>
                                            Format: github.com/username
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Profile Visibility:</label>
                                        <div class="col-lg-9">
                                            {this.state.visibility == "public" ?
                                            <select class="custom-select" ref="edit_visibility">
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                            </select>
                                            :
                                            <select class="custom-select" ref="edit_visibility">
                                                <option value="private">Public</option>
                                                <option value="public">Private</option>
                                            </select>
                                            }
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Interests:</label>
                                        <div class="col-lg-9">
                                            <div class="profile-descrption-block">
                                                <span class="d-flex flex-wrap">
                                                {
                                                    (this.state.interests|| []).map((item) => {
                                                        return( 
                                                                <span className="badge badge-pill badge-success mr-2" key={item + ' ' + tag_id++}>
                                                                {item}
                                                                <button className="fa fa-times bg-transparent border-0 p-0 pl-1 interests" 
                                                                        type="submit"
                                                                        value={item} 
                                                                        style={{ 'outline': 'none' }} 
                                                                        onClick={this.removeTag}>
                                                                </button>
                                                                </span>

                                                            )
                                                        }
                                                    )
                                                }
                                                <span className="badge badge-pill badge-primary mr-2" >
                                                        <input type="text" 
                                                        placeholder="add new interest" 
                                                        className="profile-tag-input interests" 
                                                        onKeyDown={this.addTag}/>

                                                </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Programming languages:</label>
                                        <div class="col-lg-9">
                                            <div class="profile-descrption-block">
                                                <span class="d-flex flex-wrap">
                                                {
                                                    (this.state.programming_languages || []).map((item) => {
                                                        return(
                                                                <span className="badge badge-pill badge-success mr-2" key={item + ' ' + tag_id++}>
                                                                    {item}
                                                                    <button className="fa fa-times bg-transparent border-0 p-0 pl-1 programming_languages" 
                                                                            value={item} 
                                                                            style={{ 'outline': 'none' }} 
                                                                            onClick={this.removeTag}>
                                                                    </button>
                                                                </span>
                                                                )
                                                    })                            
                                                }
                                                <span className="badge badge-pill badge-primary mr-2" >
                                                        <input type="text" 
                                                        placeholder="add new programming language" 
                                                        className="profile-tag-input programming_languages" 
                                                        onKeyDown={this.addTag}/>

                                                </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Languages Spoken:</label>
                                        <div class="col-lg-9">
                                            <div class="profile-descrption-block">
                                                <span class="d-flex flex-wrap">
                                                {
                                                    (this.state.languages || []).map((item) => {
                                                        return(
                                                                <span className="badge badge-pill badge-success mr-2" key={item + ' ' + tag_id++}>
                                                                    {item}
                                                                    <button className="fa fa-times bg-transparent border-0 p-0 pl-1 languages" 
                                                                            value={item} 
                                                                            style={{ 'outline': 'none' }} 
                                                                            onClick={this.removeTag}>
                                                                    </button>
                                                                </span>
                                                                )
                                                    })                            
                                                }
                                                <span className="badge badge-pill badge-primary mr-2" >
                                                        <input type="text" 
                                                        placeholder="add new language" 
                                                        className="profile-tag-input languages" 
                                                        onKeyDown={this.addTag}/>

                                                </span>
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">About Me:</label>
                                        <div class="col-lg-9">
                                            <textarea class="form-control" ref="edit_description" defaultValue={this.state.description}></textarea>

                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label"></label>
                                        <div class="col-lg-9 btn-toolbar  justify-content-end">
                                            <a class="btn btn-secondary mr-2 nav-item" href="/profile">
                                             Cancel 
                                             </a>
                                            <button type="submit" 
                                            class="btn btn-primary"
                                            > Save Changes </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
            </div>
          );
    }

}

export { Profile };