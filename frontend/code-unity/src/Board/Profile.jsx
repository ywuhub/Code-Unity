import React from 'react';

import { userService } from '@/_services';
import '@/Style';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.removeTag = this.removeTag.bind(this);
        this.addTag = this.addTag.bind(this);
        this.state = {
            "_id": "",
            name: "",
            email: "",
            visibility: "",
            description: "",
            interests: [],
            programming_languages: [],
            languages:[],
            github: ""
            // isEditing: false
        };

    }
    componentDidMount() {
        console.log("========componentWillReceiveProps")
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
     // <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
     //                <button type="button" class="btn btn-sm btn-outline-secondary" data-target="#edit" data-toggle="tab">Edit Profile</button>
     //                </div>
    removeTag(e) {
        e.preventDefault();
        if (e.target.classList.contains('interests')) {
            alert('Enter interests!!!');    
          let tags = this.state.interests;
          const tagIndex = tags.indexOf(e.target.value);
          if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ interests: tags });
        }

        } else if (e.target.classList.contains('programming_languages')) {
            alert('Enter programming_languages!!!');    
          let tags = this.state.programming_languages;
          const tagIndex = tags.indexOf(e.target.value);
          if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ programming_languages: tags });
            }
        }
    }

    addTag(e) {
        if (e.key === 'Enter') {
            alert('Enter clicked!!!');    
            // if (e.target.className.indexOf('interests') !== -1) {
            //   // let tags = this.state.interests;
            //   // if (tagIndex !== -1) {
            //   //   tags.splice(tagIndex, 1);
            //   //   this.setState({ interests: tags });
            //   //   // this.filterByTag(true);

            // } else if (e.target.className.indexOf('programming_languages') !== -1) {
              let tags = this.state.programming_languages;
              const newTag = e.target.value;
              tags.push(newTag);
              this.setState({ programming_languages: tags });
                // this.filterByTag(true);
            // }
        }
    }
    render() {
        let tag_id = 0;
        return (
            <div class="container">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h4">My Profile</h1>

                    <div class="nav nav-tabs btn-group mr-2" role="tablist">
                        <button type="button" class="btn btn-sm btn-outline-secondary nav-item active" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary nav-item" data-toggle="tab" href="#nav-edit" role="tab" aria-controls="nav-edit" aria-selected="false">edit</button>
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
                                                <p> {this.state.name} </p>
                                            </div>
                                            <div> 
                                                <p> {this.state.email} </p>
                                            </div>
                                            <div>
                                            {
                                                <p>
                                                {this.state.github}
                                                </p>
                                            }
                                            </div>
                                        </div>
                                        <div class="editable-alias">&nbsp;</div>

                                        <div class="col-md-12">
                                                <div> 
                                                    <h6 class="border-bottom border-gray pb-2 mb-0">About Me</h6>
                                                    <p> {this.state.description} </p> 
                                                </div>
                                                <div class="editable-alias">&nbsp;</div>

                                                <div> 
                                                    <h6 class="border-bottom border-gray pb-2 mb-0">Interests</h6>
                                                    <div class="profile-descrption-block">
                                                    {
                                                        this.state.interests.map((item) => {
                                                            return(
                                                                    <a href="#" class="badge badge-dark badge-pill mr-2">{item}</a>
                                                                )
                                                        })                            
                                                    }
                                                    </div>
                                                </div>
                                                <div class="editable-alias">&nbsp;</div>
                                                <div>
                                                    <h6 class="border-bottom border-gray pb-2 mb-0">Programming language</h6>
                                                    <div class="profile-descrption-block">
                                                    {
                                                        this.state.programming_languages.map((item) => {
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
                                <form role="form">
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">User name</label>
                                        <div class="col-lg-9">
                                            <input class="form-control" type="text" defaultValue={this.state.name} />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">{this.state.email}</label>
                                        <div class="col-lg-9">
                                            <input class="form-control" type="email" defaultValue="email@gmail.com" />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Github Address</label>
                                        <div class="col-lg-9">
                                            <input class="form-control" type="text" defaultValue={this.state.github} />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Interests</label>
                                        <div class="col-lg-9">
                                            <div class="profile-descrption-block">
                                                {
                                                    this.state.interests.map((item) => {
                                                        return( 
                                                                <span className="badge badge-pill badge-success mr-2" key={item + ' ' + tag_id++}>
                                                                {item}
                                                                <button className="fa fa-times bg-transparent border-0 p-0 pl-1 interests" 
                                                                        value={item} 
                                                                        style={{ 'outline': 'none' }} 
                                                                        onClick={this.removeTag.bind(this)}>
                                                                </button>
                                                                </span>

                                                            )
                                                    })                            
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">Programming language</label>
                                        <div class="col-lg-9">
                                            <div class="profile-descrption-block">
                                                <span class="d-flex flex-wrap">
                                                {
                                                    this.state.programming_languages.map((item) => {
                                                        return(
                                                                <span className="badge badge-pill badge-success mr-2" key={item + ' ' + tag_id++}>
                                                                    {item}
                                                                    <button className="fa fa-times bg-transparent border-0 p-0 pl-1 programming_languages" 
                                                                            value={item} 
                                                                            style={{ 'outline': 'none' }} 
                                                                            onClick={this.removeTag.bind(this)}>
                                                                    </button>
                                                                </span>
                                                                )
                                                    })                            
                                                }
                                                <span className="badge badge-pill badge-primary mr-2" >
                                                        <input type="text" 
                                                        placeholder="add new tag" 
                                                        className="profile-tag-input" 
                                                        onKeyPress={this.addTag.bind(this)}/>
                                                </span>
                                                <button className="fa fa-times bg-transparent border-0 p-0 pl-1 programming_languages" 
                                                        value="???" 
                                                        style={{ 'outline': 'none' }} 
                                                        onKeyPress={this.addTag.bind(this)}>
                                                </button>
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label">About me</label>
                                        <div class="col-lg-9">
                                            <textarea class="form-control" id="message-text" defaultValue={this.state.description}></textarea>

                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-lg-3 col-form-label form-control-label"></label>
                                        <div class="col-lg-9 btn-toolbar  justify-content-end">
                                            <a class="btn btn-secondary mr-2 nav-item" href="/profile">
                                             Cancel 
                                             </a>
                                            <button type="button" class="btn btn-primary" > Save Change </button>
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