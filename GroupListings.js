import React from 'react';
import AdvancedSearch from './AdvancedSearch';

const API_URL = 'http://localhost:8080'

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.state = {
            tags: []
        }
    }

    addTag(tag) {
        let tags = this.state.tags;
        // ignore duplicate tags
        if (tag.length > 1 && tags.indexOf(tag) === -1) {
            tags.push(tag.toLowerCase());
            this.setState({ tags:  tags});
        }
    }

    removeTag(e) {
        let tags = this.state.tags;
        const tagIndex = tags.indexOf(e.target.value);
        if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ tags: tags });
        }
    }

    render() {
        return (
            <div><FilterListings addTag={this.addTag} removeTag={this.removeTag} tags={this.state.tags}/></div>
        );    
    }
}

/**
 * Search bar that filters and shows group postings
 */
class FilterListings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPosts: [],   
            filteredPosts: []           
        };
    }

    /**
     * Initialisation when this component is first loaded into the page
     *  Fetches all posts
     */
    componentDidMount() {
        this.setState({
            initialPosts: [    
                {
                    "title": "Test Post",
                    "description": "to ny mad hip log sue Test Description",
                    "course": "COMP3161",
                    "technologies": "???",
                    "languages": "python, haskell, prolog"
                },
                {
                    "title": "Test Post 2",
                    "description": "i am the am i 21312312 Test Description 2",
                    "course": "COMP6771",
                    "technologies": "idk",
                    "languages": "C++, javascript, C, java"
                }
            ],
            filteredPosts: [
                {
                    "title": "Test Post",
                    "description": "to ny mad hip log sue Test Description",
                    "course": "COMP3161",
                    "technologies": "???",
                    "languages": "python, haskell, prolog"
                },
                {
                    "title": "Test Post 2",
                    "description": "i am the am i 21312312 Test Description 2",
                    "course": "COMP6771",
                    "technologies": "idk",
                    "languages": "C++, javascript, C, java"
                }
            ]
        });
    }

    /**
     * Filters all posts by the user input
     * @param {*} e event
     */
    filterPosts(e) {
        let posts = this.state.initialPosts;
        let filter = e.target.value.toLowerCase();
        posts = posts.filter((post) => {
            return post['title'].toLowerCase().indexOf(filter) !== -1 ||
                post['description'].toLowerCase().indexOf(filter) !== -1 ||
                post['course'].toLowerCase().indexOf(filter) !== -1 ||
                post['technologies'].toLowerCase().indexOf(filter) !== -1 ||
                post['languages'].toLowerCase().indexOf(filter) !== -1;
        });
        this.setState({
            filteredPosts: posts
        });
    }

    /**
     * Filter posts by tags
     */
    filterPosts() {
        // checked -> filter already filtered posts  unchecked -> filter all posts 
        const inclusive_search = document.getElementById('inclusive-search').checked;
        let posts = (inclusive_search) ? (this.props.tags.length !== 0) ? this.state.filteredPosts : this.state.initialPosts : this.state.initialPosts;    
        let tags = this.props.tags;

        if (tags.length !== 0) {
            posts = posts.filter((post) => {
                if (inclusive_search) {
                    return tags.every((tag) => {
                        return post['title'].toLowerCase().indexOf(tag) !== -1 ||
                        post['description'].toLowerCase().indexOf(tag) !== -1 ||
                        post['course'].toLowerCase().indexOf(tag) !== -1 ||
                        post['technologies'].toLowerCase().indexOf(tag) !== -1 ||
                        post['languages'].toLowerCase().indexOf(tag) !== -1;
                    });
                } else {
                    return tags.some((tag) => {
                        return post['title'].toLowerCase().indexOf(tag) !== -1 ||
                        post['description'].toLowerCase().indexOf(tag) !== -1 ||
                        post['course'].toLowerCase().indexOf(tag) !== -1 ||
                        post['technologies'].toLowerCase().indexOf(tag) !== -1 ||
                        post['languages'].toLowerCase().indexOf(tag) !== -1;
                    });
                }
            });
        }
        this.setState({ filteredPosts: posts });
    }

    onKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.addTag(document.getElementById('search-bar').value);
            document.getElementById('search-bar').value = '';
            this.filterPosts();
        }
    }

    removeTag(e) {
        this.props.removeTag(e);
        this.filterPosts();
    }

    inclusiveSearch(e) {
        this.filterPosts();
    }

    /**
     * Shows component
     */
    render() {
        return (
            <div className="row">
                <div className="col-sm-7">
                    <ShowPosts posts={this.state.filteredPosts} />
                </div>

                <div className="col-sm-5">
                    {/* search bar */}
                    <div className="input-group bg-dark shadow-sm" style={{'borderRadius':'5px'}}>
                        <input type="text" id="search-bar" className="form-control bg-transparent p-4 pr-5 border" style={{'borderRadius':'5px', 'color':'white', 'borderTopRightRadius':'0px', 'borderBottomRightRadius':'0px'}} placeholder="Search" onKeyPress={this.onKeyPress.bind(this)}></input>
                        <div className="input-group-append">
                            <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                        </div>
                        <button type="button" className="btn btn-dark border fa fa-caret-down" data-toggle="collapse" data-target="#advancedSearch" style={{'borderTopLeftRadius':'0px', 'borderBottomLeftRadius':'0px'}} onClick={collapseChange.bind(this)}></button> 
                    </div>

                    <AdvancedSearch /> <br/>

                    {/* tags */}
                    <div className="card-footer rounded mb-5 border bg-light shadow-sm"> 
                        <div className="clearfix">
                            <div className="float-left">
                                <span className="mr-2 p-2 text-muted">
                                    <i>Search Tags:</i>
                                </span>
                            </div>
                            <div className="float-right">
                                <div className="custom-control custom-switch">
                                    <input type="checkbox" className="custom-control-input" value="false" id="inclusive-search" onClick={this.inclusiveSearch.bind(this)}></input>
                                    <label className="custom-control-label" htmlFor="inclusive-search">Inclusive</label>
                                </div>
                            </div>
                        </div>

                        <div id="tags">
                        {
                            this.props.tags.map((tag) => {
                                return (
                                    <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={tag}>{tag}<button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={tag} style={{'outline':'none'}} onClick={this.removeTag.bind(this)}></button></span>
                                );
                            })
                        }
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
    return (
        <ul className="list-group">
        {
            props.posts.map((post) => {
                return <li className="list-group-item mb-3" key={post['title']}>{post['title']}<br/>{post['description']}<br/>{post['course']}<br/>{post['languages']}<br/>{post['technologies']}</li>
            })
        }
        </ul>
    );
}

export default Search;