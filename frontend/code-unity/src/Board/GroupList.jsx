import React from 'react';
import AdvancedSearch from './AdvancedSearch';
import config from 'config';
import { authHeader } from '@/_helpers';

const API_URL = 'http://localhost:4000'

/**
 * Search bar that filters and shows group postings
 */
class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.addTags = this.addTags.bind(this);
    this.state = {
      initialPosts: [],
      filteredPosts: [],
      tags: [],
      isLoading: false
    };
  }

  /**
   * Initialisation when this component is first loaded into the page
   *  Fetches all posts
   */
  componentDidMount() {
    this.setState({ isLoading: true });
    const projects_options = { method: 'GET', headers: authHeader() };
    fetch(API_URL + '/api/project/list', projects_options)
      .then(response => { return response.json() })
      .then(json => {
        json.forEach(post => {
          fetch(API_URL + '/api/project/' + post['project_id'], projects_options)
            .then(project_post => { return project_post.json() })
            .then(post => {
              let initial = this.state.initialPosts;
              initial.push(post)
              let filtered = this.state.filteredPosts;
              filtered.push(post)
              this.setState({
                initialPosts: initial,
                filteredPosts: filtered,
              });
            })
        })
      })
      .then(() => {
        this.setState({
          isLoading: false
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
    let contains = false;
    for (let key of Object.keys(post)) {
      if (typeof post[key] === 'string') {
        contains = (post[key].toLowerCase().indexOf(filter) !== -1);
        if (contains) break;
        
      } else {
        contains = (Array.from(post[key]).toString().toLowerCase().indexOf(filter) !== -1);
        if (contains) break;
      }
    }
    return contains;
  }

  /**
   * Filters all posts by the user input
   *  filters as user types
   * @param {*} e event
   */
  filterPosts(e) {
    let posts = (this.state.tags.length !== 0) ? this.state.filteredPosts : this.state.initialPosts;
    let filter = e.target.value.toLowerCase();

    // filtering posts when input filter is empty
    if (/^(\s+|)$/.test(filter)) {
      if (this.state.tags.length !== 0) this.filterByTag();
      else this.setState({ filteredPosts: posts });

      // filter posts acorrding to input filter
    } else {
      posts = posts.filter((post) => {
        return this.containsFilter(post, filter);
      });
      this.setState({ filteredPosts: posts });
    }
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

        this.filterByTag(!append, false);
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

        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h4">Groups</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2">
              <button type="button" className="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#exampleModalCenter">Create New Group</button>
            </div>
            {/* <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                           	<span data-feather="calendar"></span>
                                This week
                        </button>*/}
          </div>
        </div>

        <div className="row">
          <div className="col-sm-7 my-3 p-3 bg-white rounded shadow-sm">
            <h6 className="border-bottom border-gray mb-0 d-flex justify-content-between">
              Find a new Group 
              <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input" id="full-groups-switch"></input>
                <label className="custom-control-label text-muted" htmlFor="full-groups-switch">Hide Full Groups</label>
              </div>
            </h6>
            

            {this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>}

            {/* Shows all group listings */}
            {!this.isLoading && <ShowPosts posts={this.state.filteredPosts} />}

            <small className="d-block text-right mt-3">
              <a href="#">All Groups</a>
            </small>
          </div>

          <div className="col-sm-5 ">
            {/* shows tags */}
            <div className="card-footer rounded mb-3 border shadow-sm p-0 px-2 py-2">
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

            {/* search bar */}
            <div className="input-group bg-dark shadow-sm mb-1" style={{ 'borderRadius': '5px' }}>
              <input type="text" id="search-bar" className="form-control bg-transparent p-4 pr-5 border" style={{ 'borderRadius': '5px', 'color': 'white', 'borderTopRightRadius': '0px', 'borderBottomRightRadius': '0px' }} placeholder="Search" onKeyPress={this.onKeyPress.bind(this)} onChange={this.filterPosts.bind(this)}></input>
              <div className="input-group-append">
                <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
              </div>
              <button type="button" className="btn btn-dark border fa fa-caret-down" data-toggle="collapse" data-target="#advancedSearch" style={{ 'borderTopLeftRadius': '0px', 'borderBottomLeftRadius': '0px' }} onClick={collapseChange.bind(this)}></button>
            </div>

            {/* Advanced Search component */}
            <AdvancedSearch addTags={this.addTags} filterByKey={this.filterByKey.bind(this)} /> <br />

          </div>

        </div>

        {/* Create group modal */}
        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Create New Group</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <label htmlFor="message-text" className="col-form-label">Group Name:</label>
                  <div className="input-group input-group-sm mb-3">
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message-text" className="col-form-label">Description:</label>
                    <textarea className="form-control" id="message-text"></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
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
  let post_key = 0;
  return (
    <div>
      {
        props.posts.map((post) => {
            return (
              <div class="media text-muted pt-3" key={post_key++}>
                <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <strong class="text-gray-dark">{post['title']}</strong>
                    { post['max_people'] !== post['cur_people'] && <a href="#">Join</a> }
                  </div>

                  {/* Show all the information in post  */}
                  <ShowPost post={post}/>
                </div>
              </div>
            );
        })
      }
    </div>
  );
}

function ShowPost(props) {
  const items = [];
  let post = props.post;
  let post_info_key = 0;

  for (let key in post) {
    const info = post[key];
    if (typeof info !== 'object') {
      items.push(<span className="d-block" key={post_info_key++}> {key} : {info} </span>);
    } else {
      items.push(<span className="d-block" key={post_info_key++}> {key} : {Array.from(info).join(', ')} </span>);
    }
  }
  return (
    <div>
      {items}
    </div>
  );
}

export { GroupList };