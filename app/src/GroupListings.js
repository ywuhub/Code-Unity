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
        // fetch(API_URL + '/api/project/list')
        //     .then(response => {return response.json()})
        //     .then(json => {
        //         this.setState({ 
        //             initialPosts: json,
        //             filterPosts: json
        //         });
        //     })
        //     .catch(err => { console.log(err); });

        // Placeholder project list
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
        this.setState({ filteredPosts: posts });
    }

    /**
     * Filter posts by tags
     */
    filterPosts(tagRemoved = false) {
        const inclusive_search = document.getElementById('inclusive-search').checked;  // checked -> filter filtered posts  unchecked -> filter all posts 
        let posts = (inclusive_search) ? (this.state.tags.length !== 0 && !tagRemoved) ? this.state.filteredPosts : this.state.initialPosts : this.state.initialPosts;    
        let tags = this.state.tags;

        if (tags.length !== 0) {
            posts = posts.filter((post) => {
                // get posts containing all tags
                if (inclusive_search) {
                    return tags.every((tag) => {
                        return post['title'].toLowerCase().indexOf(tag) !== -1 ||
                            post['description'].toLowerCase().indexOf(tag) !== -1 ||
                            post['course'].toLowerCase().indexOf(tag) !== -1 ||
                            post['technologies'].toLowerCase().indexOf(tag) !== -1 ||
                            post['languages'].toLowerCase().indexOf(tag) !== -1;
                    });

                // get posts containing at least one tag 
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
            this.addTag(e.target.value);
            document.getElementById('search-bar').value = '';
            this.filterPosts();
        }
    }

    inclusiveSearch(e) {
        this.filterPosts();
    }

    addTag(tag) {
        let tags = this.state.tags;
        // ignore duplicate tags
        if (tag.length > 1 && tags.indexOf(tag) === -1) {
            tags.push(tag.toLowerCase());
            this.setState({ tags:  tags});
        }
    }

    // addTags(tags)    forEach   ...   pass to advanced    

    removeTag(e) {
        let tags = this.state.tags;
        const tagIndex = tags.indexOf(e.target.value);
        if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ tags: tags });
            this.filterPosts(true);
        }
    }

    /**
     * Shows component
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
                    <div className="input-group bg-dark shadow-sm mb-1" style={{'borderRadius':'5px'}}>
                        <input type="text" id="search-bar" className="form-control bg-transparent p-4 pr-5 border" style={{'borderRadius':'5px', 'color':'white', 'borderTopRightRadius':'0px', 'borderBottomRightRadius':'0px'}} placeholder="Search" onKeyPress={this.onKeyPress.bind(this)}></input>
                        <div className="input-group-append">
                            <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                        </div>
                        <button type="button" className="btn btn-dark border fa fa-caret-down" data-toggle="collapse" data-target="#advancedSearch" style={{'borderTopLeftRadius':'0px', 'borderBottomLeftRadius':'0px'}} onClick={collapseChange.bind(this)}></button> 
                    </div>

                    <AdvancedSearch addTag={this.addTag} removeTag={this.removeTag}/> <br/>

                    {/* tags */}
                    <div className="card-footer rounded mb-5 border shadow-sm"> 
                        <div className="d-flex justify-content-between">
                            <i className="mr-4 p-2 text-muted"> Search Tags:</i>
                            <div className="custom-control custom-switch p-2">
                                <input type="checkbox" className="custom-control-input" value="false" id="inclusive-search" onClick={this.inclusiveSearch.bind(this)}></input>
                                <label className="custom-control-label text-muted" htmlFor="inclusive-search">Inclusive</label>
                            </div>
                        </div>

                        <div id="tags">
                        {
                            this.state.tags.map((tag) => {
                                return (
                                    <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={tag + ' ' + tag_id++}>{tag}<button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={tag} style={{'outline':'none'}} onClick={this.removeTag.bind(this)}></button></span>
                                );
                            })
                        }
                        </div>
                    </div>

                    <div className="card h-80" style={{'textAlign':'center'}}>
                        <div className="card-body">
                        <h1 className="card-title">Ads c:</h1>
                        <p>
                        ────────────────────────────────────────
                        ──────────────────────▒████▒────────────
                        ───────────────────░█████▓███░──────────
                        ─────────────────░███▒░░░░░░██──────────
                        ────────────────▒██▒░░░▒▓▓▓▒░██─────────
                        ───────────────▓██░░░▒▓█▒▒▒▓▒▓█─────────
                        ──────────────▓█▓─░▒▒▓█─────▓▓█░────────
                        ─────────────▓█▒░▒▒▒▒█──▓▓▒▒─▓█▒────────
                        ────────────▒█▒░▒▒▒▒▓▒─▒▓▒▓▓─▒█░────────
                        ────────────█▓░▒▒▒▒▒▓░─▓▒──░░▒█░────────
                        ───────────██░▒▒▒▒▒▒█──▓──░▓████████────
                        ──────────░█▒▒▒▒▒▒▒▒▓░─█▓███▓▓▓▓██─█▓───
                        ────────▒▓█▓▒▒▒▒▒▒▒▒▓███▓▓████▓▓██──█───
                        ──────░███▓▒▒▒▒▓▒▒▒████▒▒░░──████░──██░─
                        ──────██▒▒▒▒▒▒▒▒▒▓██▒────────▒██▓────▓█─
                        ─────▓█▒▒▒▒▒▒▒▒▓█▓─────▓───▒░░▓──▓────▓█
                        ─────██▒▓▒▒▒▒▒█▓──────▒█▓──▓█░▒──▒░────█
                        ─────██▒▒▓▓▓▒█▓▓───░──▓██──▓█▓▓▓█▓─────█
                        ─────▓█▒██▓▓█▒▒▓█─────░█▓──▒░───░█▓────█
                        ─────░██▓───▓▓▒▒▓▓─────░─────────▒▒─░─░█
                        ──────▓█──▒░─█▒▓█▓──▒───────░─░───█▒──█▒
                        ───────█──░█░░█▓▒──▓██▒░─░─░─░─░░░█▒███─
                        ───────█▒──▒▒──────▓██████▓─░░░░─▒██▓░──
                        ───────▓█──────────░██▓▓▓██▒─░──░█▒─────
                        ────────██▒─────░───░██▓▓▓██▓▒▒▓█▒──────
                        ─────────░████▒──░───▒█▓▓▓▓▓████▓───────
                        ────────▒▓██▓██▒──░───▓█████▓███────────
                        ──────▒██▓░░░░▓█▓░────░█▒█▒─▒▓█▓────────
                        ─────▓█▒░░▒▒▒▒▒▓███▓░──▓█▒─▒▓▓█─────────
                        ────░█▒░▒████▓██▓▓▓██▒───░▓█▓█░─────────
                        ────▓█▒▒█░─▒───▓█▓▓▓▓▓▓▒▒▓█▓█▓──────────
                        ────▓█▒█░───────██▓▓▓▓▓█▓▓█▓██──────────
                        ────▒█▓▓────────░██▓██▓▓▓▓▓▓▓▓█─────────
                        ─────██░────▓▓────█░─█▓▓▓▓▓▓▓─▒█████────
                        ─────██░───░──────▓░─▓▓▓▓▓▓▓█─▒█▒░▒██───
                        ────▓█░▓░──▓▓────▒█░─█▓▓▓▓▓▓▓█▒─░░░▒██──
                        ────█─▒██─░──────████▓▓▓▓▓▓▓█▓─░▒▒█▓▓█░─
                        ───▓█─▓▒▓▒░░────▓█▓▓▓▓▓▓▓▓▓▓█░░▒▓█░──▒█─
                        ───▒█░█▒▒█▒───░▓█▓▓▓▓▓▓▓▓▓▓█▓░▒▓▓──▓█▓█─
                        ───█▓▒▓▒▒▓██████▓▓▓▓▓▓▓▓▓▓▓█▒▒▓▓─░█▓▒▒█░
                        ───█░▓▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▒▒▓─▒█▒▒▒▒█─
                        ──▒█─█▒▒▒▓█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▓─▒█▒▒▒▒██─
                        ──▓█─█▒▒▒▒█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▒▓▒░█▒▒▒░▓█──
                        ──▓█─█▒▓▒▒▓█▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▒▓░▓░░░░▒█░──
                        ──▒█─▓▓▓▓▒▓█▓▓▓▓▓▓▓▓█████▓▓▓▓▒▓░░─▒█▒───
                        ───█▒▓▓▓▓▓▒▓██████████░░██▓█─▒█▓▒▓█░────
                        ───▓█▒█▓▓▓▓▒▓██░─░▒░─────██▒░▓▓▓▒██─────
                        ────████▓▓▓██░───────────▓█░▓▒░░▓█░─────
                        ──────░█████░─────────────██▓─▒██░──────
                        ───────────────────────────▓███▒────────
                        </p>
                        </div>

                    </div>

                    <div className="d-flex">
                        <a href="#page-start" className="ml-auto bg-transparent border-0" style={{'fontSize':'5vw', 'outline':'none'}}><i className="fas fa-angle-up"></i></a>
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
                            <p className="card-text"> Description: {post['description']}<br/> Course: {post['course']}<br/> Programming Languages: {post['languages']}<br/> Technologies: {post['technologies']} </p>
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