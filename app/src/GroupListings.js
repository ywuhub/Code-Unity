import React from 'react';
import AdvancedSearch from './AdvancedSearch';

const API_URL = 'http://localhost:8080'

/**
 * Search bar that filters and shows group postings
 */
class FilterListings extends React.Component {
    constructor(props) {
        super(props);
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.addTags = this.addTags.bind(this);
        this.state = {
            initialPosts: [],
            filteredPosts: [],
            tags: []
        };
    }

    /**
     * Initialisation when this component is first loaded into the page
     *  Fetches all posts
     */
    componentDidMount() {
        fetch(API_URL + '/api/project/list')
            .then(response => {return response.json()})
            .then(json => {
                this.setState({ 
                    initialPosts: [    
                        {
                            "title": "Placeholder Post",
                            "description": "to ny mad hip log sue Test Description",
                            "course": "COMP3161",
                            "technologies": "???",
                            "languages": "python, haskell, prolog"
                        },
                        {
                            "title": "Placeholder Post 2",
                            "description": "i am the am i 21312312 Test Description 2",
                            "course": "COMP6771",
                            "technologies": "idk",
                            "languages": "C++, javascript, C, java"
                        },
                        {
                            "title": "Placeholder Post 3",
                            "description": "to ny mad hip log sue Test Description",
                            "course": "COMP3900",
                            "technologies": "???",
                            "languages": "python, haskell, prolog"
                        },
                        {
                            "title": "Placeholder Post 4",
                            "description": "i am the am i 21312312 Test Description 2",
                            "course": "COMP9444",
                            "technologies": "idk",
                            "languages": "C++, javascript, C, java"
                        },
                        {
                            "title": "Placeholder Post 4",
                            "description": "i am the am i 21312312 Test Description 2",
                            "course": "COMP4920",
                            "technologies": "idk",
                            "languages": "C++, C, java, boom"
                        },
                        {
                            "title": "Placeholder Post 4",
                            "description": "i am the am i 21312312 Test Description 2",
                            "course": "COMP9242",
                            "technologies": "poof",
                            "languages": "C++, javascript"
                        }
                    ],
                    filteredPosts: [    
                        {
                            "title": "Placeholder Post",
                            "description": "to ny mad hip log sue Test Description",
                            "course": "COMP3161",
                            "technologies": "???",
                            "languages": "python, haskell, prolog"
                        },
                        {
                            "title": "Placeholder Post 2",
                            "description": "i am the am i 21312312 Test Description 2",
                            "course": "COMP6771",
                            "technologies": "idk",
                            "languages": "C++, javascript, C, java"
                        },
                        {
                            "title": "Placeholder Post 3",
                            "description": "to ny mad hip log sue Test Description",
                            "course": "COMP3900",
                            "technologies": "???",
                            "languages": "python, haskell, prolog"
                        },
                        {
                            "title": "Placeholder Post 4",
                            "description": "i am the am i 21312312 Test Description 2",
                            "course": "COMP9444",
                            "technologies": "idk",
                            "languages": "C++, javascript, C, java"
                        },
                        {
                            "title": "Placeholder Post 4",
                            "description": "i am the am i 21312312 Test Description 2",
                            "course": "COMP4920",
                            "technologies": "idk",
                            "languages": "C++, C, java, boom"
                        },
                        {
                            "title": "Placeholder Post 4",
                            "description": "i am the am i 21312312 Test Description 2",
                            "course": "COMP9242",
                            "technologies": "poof",
                            "languages": "C++, javascript"
                        }
                    ]
                });
            })
            .catch(err => { console.log(err); });
    }

    /**
     * Checks if a post contains a string
     * @param {*} post      
     * @param {*} filter    string to find
     */
    containsFilter(post, filter) {
        return post['title'].toLowerCase().indexOf(filter) !== -1 ||
            post['description'].toLowerCase().indexOf(filter) !== -1 ||
            post['course'].toLowerCase().indexOf(filter) !== -1 ||
            post['languages'].toLowerCase().indexOf(filter) !== -1 ||
            post['technologies'].toLowerCase().indexOf(filter) !== -1;
        // return post['leader'].toLowerCase().indexOf(filter) !== -1 ||
        //     post['title'].toLowerCase().indexOf(filter) !== -1 ||
        //     post['description'].toLowerCase().indexOf(filter) !== -1 ||
        //     post['course'].toLowerCase().indexOf(filter) !== -1 ||
        //     post['tags'].toLowerCase().indexOf(filter) !== -1 ||
        //     post['languages'].toLowerCase().indexOf(filter) !== -1 ||
        //     post['technologies'].toLowerCase().indexOf(filter) !== -1;
    }

    /**
     * Filters all posts by the user input
     *  filters as user types
     * @param {*} e event
     */
    filterPosts(e) {
        //let posts = this.state.initialPosts;
        let filter = e.target.value.toLowerCase();
        if (this.state.tags.length !== 0) {
            // filter/user input empty and tags not empty  then filter by tag   (if already fitlered by projec title/leader -> reset/ignores b/c too complex)
            if (/^(\s+|)$/.test(filter)) this.filterByTag();
            
            // filter not empty and there are tags      
            else {
                // filter the filtered posts (filtered from tags)
                let posts = this.state.filteredPosts;   // fitlered not initial  for when filtered by title/leader already      if want ignore altogether -> initialposts
                posts = posts.filter((post) => {
                    return this.containsFilter(post, filter);
                });
                this.setState({ filteredPosts: posts });    
            }
            
        } else {
            // filter empty and there are no tags
            if (/^(\s+|)$/.test(filter)) {
                let posts = this.state.initialPosts;
                this.setState({ filteredPosts: posts });
            } 

            // filter not empty and there are no tags
            else {
                let posts = this.state.initialPosts; 
                posts = posts.filter((post) => {
                    return this.containsFilter(post, filter);
                });
                this.setState({ filteredPosts: posts });    
            }
        }
        
        
        // let posts = (filter === '') ? this.state.initialPosts : this.state.filteredPosts;
        // if (filter !== '') {
        //     posts = posts.filter((post) => {
        //         return this.containsFilter(post, filter);
        //     });
        //     this.setState({ filteredPosts: posts });

        // } else if (filter === '') {
        //     if (this.state.tags.length !== 0) this.filterByTag();
        //     else this.setState({ filteredPosts: posts });

        // }
    }

    /**
     * Filter posts by currently selected tags
     */
    filterByTag(tagRemoved = false, onFilteredTags = false) {
        const inclusive_search = document.getElementById('inclusive-search').checked;  // checked -> filter filtered posts  unchecked -> filter all posts 
        let posts = (inclusive_search) ? ((this.state.tags.length !== 0 && !tagRemoved) || onFilteredTags) ? this.state.filteredPosts : this.state.initialPosts : this.state.initialPosts;
        let tags = this.state.tags;

        // nonempty search bar filter posts
        const search_filter = document.getElementById('search-bar').value;
        if (!(/^(\s+|)$/.test(search_filter))) {
            posts = posts.filter((post) => {
                return this.containsFilter(post, search_filter);
            });
        }

        // filter posts by all tags selected
        if (tags.length !== 0) {
            posts = posts.filter((post) => {
                // get posts containing all tags if 'contains all' option selected else get posts containing at least one tag  
                return (inclusive_search) ? tags.every((tag) => { return this.containsFilter(post, tag); }) : tags.some((tag) => { return this.containsFilter(post, tag); });;
            });
        }

        this.setState({ filteredPosts: posts });
    }

    /**
     * Filters based on specific key/part of post e.g. title, leader, course, etc
     * @param {*} key   
     * @param {*} name 
     */
    filterByKey(key, name) {
        // let posts = this.state.initialPosts;
        let posts = this.state.filteredPosts;
        name = name.toLowerCase();

        posts = posts.filter((post) => {
            return post[key].toLowerCase().indexOf(name) !== -1;
        });

        this.setState({ filteredPosts: posts });
    }

    /**
     * Filters posts when on new user input
     *  Called when user presses enter in search bar
     * @param {*} e event
     */
    onKeyPress(e) {
        if (e.key === 'Enter') {
            // check empty string ?
            this.addTag(e.target.value);
            document.getElementById('search-bar').value = '';
            this.filterByTag();
        }
    }

    /**
     * Add tag to currently selected search tags
     * @param {*} tag 
     */
    addTag(tag) {
        let tags = this.state.tags;
        tag = tag.toLowerCase();
        // ignore duplicate tags
        if (tag.length > 1 && tags.indexOf(tag) === -1) {
            tags.push(tag);
            this.setState({ tags: tags });
        }

    }

    /**
     * Adds a list of tags to currently selected tags
     * @param {*} tags 
     * @param {*} append 
     */
    addTags(tags, append = false) {
        new Promise((resolve, reject) => {
            if (!append) this.setState({ tags: [] });
            resolve(this.state.tags);
        })
            .then(resp => {
                tags.forEach(tag => {
                    if (!append || tags.indexOf(tag) !== -1) this.state.tags.push(tag);
                });

                this.filterByTag(false, false);
            })
            .catch(error => { console.log(error) });
    }

    /**
     * Removes tag selected
     * @param {*} e event
     */
    removeTag(e) {
        let tags = this.state.tags;
        const tagIndex = tags.indexOf(e.target.value);
        if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ tags: tags });
            this.filterByTag(true);
        }
    }

    /**
     * Shows group listing page
     */
    render() {
        let tag_id = 0;
        return (
            <div id="page-start">
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-3">Group Listings</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-7">
                        <ShowPosts posts={this.state.filteredPosts} />
                    </div>
                    <div className="col-sm-5">
                        {/* search bar */}
                        <div className="input-group bg-dark shadow-sm mb-1" style={{ 'borderRadius': '5px' }}>
                            <input type="text" id="search-bar" className="form-control bg-transparent p-4 pr-5 border" style={{ 'borderRadius': '5px', 'color': 'white', 'borderTopRightRadius': '0px', 'borderBottomRightRadius': '0px' }} placeholder="Search" onKeyPress={this.onKeyPress.bind(this)} onChange={this.filterPosts.bind(this)}></input>
                            <div className="input-group-append">
                                <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                            </div>
                            <button type="button" className="btn btn-dark border fa fa-caret-down" data-toggle="collapse" data-target="#advancedSearch" style={{ 'borderTopLeftRadius': '0px', 'borderBottomLeftRadius': '0px' }} onClick={collapseChange.bind(this)}></button>
                        </div>

                        <AdvancedSearch addTags={this.addTags} filterByKey={this.filterByKey.bind(this)} /> <br />

                        {/* shows tags */}
                        <div className="card-footer rounded mb-5 border shadow-sm">
                            <div className="d-flex justify-content-between">
                                <i className="mr-4 p-2 text-muted"> Search Tags:</i>
                                <div className="custom-control custom-switch p-2">
                                    <input type="checkbox" className="custom-control-input" value="false" id="inclusive-search" onClick={this.filterByTag.bind(this)}></input>
                                    <label className="custom-control-label text-muted" htmlFor="inclusive-search">Contains All</label>
                                </div>
                            </div>

                            <div id="tags">
                                {
                                    this.state.tags.map((tag) => {
                                        return (
                                            <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={tag + ' ' + tag_id++}>{tag}<button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={tag} style={{ 'outline': 'none' }} onClick={this.removeTag.bind(this)}></button></span>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Change collapse component icon on click
 * @param {*} e event
 */
function collapseChange(e) {
    if (e.target.className.indexOf('down') !== -1) {
        e.target.className = "btn btn-dark border fa fa-caret-up";
    } else {
        e.target.className = "btn btn-dark border fa fa-caret-down";
    }
}

/**
 * Shows each filtered post onto the page
 * @param {*} props 
 */
function ShowPosts(props) {
    let post_id = 0;
    return (
        <div>
            <ul className="list-group">
                {
                    props.posts.map((post) => {
                        return (
                            <li className="list-group-item card post mb-3 bg-light" key={post['title'] + ' ' + post_id++}>
                                <div className="card-body">
                                    <h4 className="card-title"> {post['title']} </h4>
                                    <p className="card-text"> Tags: {post['tags']} <br/> Description: {post['description']}<br /> Course: {post['course']}<br /> Programming Languages: {post['languages']}<br /> Technologies: {post['technologies']} </p>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default FilterListings;