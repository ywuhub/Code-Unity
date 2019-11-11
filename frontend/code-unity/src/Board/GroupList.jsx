import React from 'react';
import AdvancedSearch from './AdvancedSearch';
import GroupPost from './GroupPost';
import config from 'config';
import { authHeader } from '@/_helpers';

import '@/Style';

const POSTS_PER_PAGE = 5;

/**
 * Search bar that filters and shows group postings
 */
class GroupList extends React.Component {

  constructor(props) {
    super(props);
    this.isMounted_ = false;
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.addTags = this.addTags.bind(this);
    this.state = {
      initialPosts: [],
      filteredPosts: [],
      postsLength: 0,
      page: 1,
      tags: [],
      excluded_tags: [],
      hidePosts: false,
      isLoading: false
    };
  }

  componentWillUnmount() {
    this.isMounted_ = false;
  }

  /**
   * Initialisation when this component is first loaded into the page
   *  Fetches all posts
   */
  componentDidMount() {
    this.isMounted_ = true;
    this.setState({ isLoading: true });
    const projects_options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() } };
    fetch(`${config.apiUrl}` + '/api/project/list', projects_options)
      .then(response => { return response.json() })
      .then(posts => {
        if (this.isMounted_) this.setState({ initialPosts: posts, filteredPosts: posts.slice(0, POSTS_PER_PAGE), postsLength: posts.length });
      })
      .then(() => {
        if (this.isMounted_) this.setState({ isLoading: false });
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
      if (typeof post[key] === 'string') contains = (post[key].toLowerCase().indexOf(filter) !== -1);
      else contains = (Array.from(post[key]).toString().toLowerCase().indexOf(filter) !== -1);
      if (contains) break;
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
        return (inclusive_search) ? tags.every((tag) => { return this.containsFilter(post, tag); }) : tags.some((tag) => { return this.containsFilter(post, tag); });
      });
    }

    if (this.state.excluded_tags.length !== 0) {
      const excluded_tags = this.state.excluded_tags;
      posts = posts.filter((post) => {
        return excluded_tags.every((tag) => { return !this.containsFilter(post, tag); });
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
      this.addTag(e.target.value);
      document.getElementById(e.target.id).value = '';
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
   * @param {*} excluded_tags
   * @param {*} append 
   */
  addTags(tags, excluded_tags, append = false) {
    new Promise((resolve, reject) => {
      if (!append) this.setState({ tags: [] });
      resolve(this.state.tags);
    })
      .then(resp => {
        tags.forEach(tag => {
          if (!append || this.state.tags.indexOf(tag) === -1) this.state.tags.push(tag);
        });

        excluded_tags.forEach(tag => {
          if (!append || this.state.excluded_tags.indexOf(tag) === -1) this.state.excluded_tags.push(tag);
        });

        this.filterByTag(!append, false);
      })
      .catch(error => { console.log(error) });
  }

  setPosts(posts) {
    this.setState({
      initialPosts: posts,
      filteredPosts: posts,
      tags: [],
      excluded_tags: [],
      isLoading: false
    })
  }

  setLoading() {
    this.setState({ isLoading: true });
  }

  /**
   * Removes tag selected
   * @param {*} e event
   */
  removeTag(e) {
    if (e.target.className.indexOf('excluded') !== -1) {
      let tags = this.state.excluded_tags;
      const tagIndex = tags.indexOf(e.target.value);
      if (tagIndex !== -1) {
        tags.splice(tagIndex, 1);
        this.setState({ excluded_tags: tags });
        this.filterByTag(true);
      }

    } else {
      let tags = this.state.tags;
      const tagIndex = tags.indexOf(e.target.value);
      if (tagIndex !== -1) {
        tags.splice(tagIndex, 1);
        this.setState({ tags: tags });
        this.filterByTag(true);
      }
    }
  }

  toggleHidePost(e) {
    const hide = !this.state.hidePosts;
    this.setState({ hidePosts: hide });
  }

  paginationClick(e) {
    const page_clicked = parseInt(e.target.innerText);

    if (page_clicked === this.state.page) return;

    const startIndex = (page_clicked - 1) * POSTS_PER_PAGE;
    const endIndex = page_clicked * POSTS_PER_PAGE;

    const posts = this.state.initialPosts;

    this.setState({ page: page_clicked })
    this.setState({ filteredPosts: posts.slice(startIndex, endIndex) });
  }

  /**
   * Shows group listing page
   */
  render() {
    let post_key = 0;
    return (
      <div id="page-start">

        {/* page header */}
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h4">Groups</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2">
              <button type="button" className="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#exampleModalCenter">Create New Group</button>
            </div>
          </div>
        </div> {/* page header end */}

        <div className="row">
          {/* Group Listings Column */}
          <div className="col-sm-8 rounded shadow-sm">

            {/* content header */}
            <div className="border-bottom border-gray">
              <h6 className="mb-0 d-flex justify-content-between">
                Find a new Group
                <div className="custom-control custom-switch">
                  <input type="checkbox" className="custom-control-input" id="full-groups-switch" onClick={this.toggleHidePost.bind(this)}></input>
                  <label className="custom-control-label text-muted" htmlFor="full-groups-switch">Hide Full Groups</label>
                </div>
              </h6>

              <div className="input-group bg-light border-bottom shadow-sm rounded-pill mt-3 mb-4">
                <input type="text" id="search-bar" className="form-control bg-transparent rounded-pill p-4 pr-5 border-0" placeholder="Search" onKeyPress={this.onKeyPress.bind(this)} onChange={this.filterPosts.bind(this)}></input>
                <div className="input-group-append">
                  <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                </div>
              </div>
            </div> {/* content header end */}

            {/* search tags */}
            <div className="my-3 border-0 p-0 px-2">
              <div className="d-flex justify-conteFnt-between">
                <i className="mr-4 text-muted"> Search Tags:</i>
                <div className="custom-control custom-switch">
                  <input type="checkbox" className="custom-control-input" value="false" id="inclusive-search" onClick={this.filterByTag.bind(this)}></input>
                  <label className="custom-control-label text-muted" htmlFor="inclusive-search">Contains All</label>
                </div>
              </div>

              <div id="tags">
                {
                  this.state.tags.map((tag) => {
                    return (
                      <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={tag}>{tag}<button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={tag} style={{ 'outline': 'none' }} onClick={this.removeTag.bind(this)}></button></span>
                    );
                  })
                }
                <br />
                {
                  this.state.excluded_tags.map((tag) => {
                    return (
                      <span className="badge badge-pill badge-danger p-2 mx-1 my-2" key={tag}>{tag}<button className="fa fa-times bg-transparent border-0 p-0 pl-1 excluded" value={tag} style={{ 'outline': 'none' }} onClick={this.removeTag.bind(this)}></button></span>
                    );
                  })
                }
              </div>
            </div> {/* search tags end */}

            <hr />

            {/* Shows all group listings */}
            {this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>}
            {!this.state.isLoading &&
              this.state.filteredPosts.map((post) => {
                return <div key={post_key++}><GroupPost post={post} hidePosts={this.state.hidePosts} /></div>;
              })
            }

            {!this.state.isLoading && 
              <Pagination posts_length={this.state.postsLength} page={this.state.page} onClick={this.paginationClick.bind(this)} />
            }
          </div> {/* Group Listings Column End */}

          {/* Advanced Search Column */}
          <div className="col-sm-4">
            <AdvancedSearch addTags={this.addTags} setPosts={this.setPosts.bind(this)} setLoading={this.setLoading.bind(this)} filterByKey={this.filterByKey.bind(this)} />
          </div>
        </div>  {/* row end */}

        <br />

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
        </div> {/* Create group modal end */}
        
      </div>
    );
  }
}

function Pagination(props) {
  const page = props.page;

  const len = props.posts_length;
  const num_pages = Math.ceil(len / POSTS_PER_PAGE);

  let numbers = [];
  for (let i = 1; i <= num_pages; ++i) {
    if (i === page) {
      numbers.push(<button key={i} className="btn btn-custom btn-active" onClick={props.onClick}>{i}</button>);
    } else {
      numbers.push(<button key={i} className="btn btn-custom" onClick={props.onClick}>{i}</button>);
    }
  }

  return (
    <div className="pagination my-4">
      <button className="btn btn-custom"><i className="fas fa-angle-double-left"></i></button>
      {numbers}
      <button className="btn btn-custom"><i className="fas fa-angle-double-right"></i></button>
    </div>
  );
}

export { GroupList };