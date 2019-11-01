import React from 'react';
import { LanguageSearch, CourseSearch, ProgrammingLanguageSearch } from './SearchFilters';

/**
 * Advanced Search component
 *  Contains input/search boxes for user input
 *  Users type into input boxes provided and press enter to add as a tag
 *  Keeps track of all tags inputted by the user
 * 
 *  2 sections : "Search Posts By" and "Then Filter Tags By"
 *      Search Posts By: filled in fields in this section makes a fetch call to api to get a set of posts based on these input values
 *      Then Filter Tags By: fields in this section filters posts obtained from Search Posts By
 */
class AdvancedSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // search_tags: {
            //     titles: [],
            //     courses: [],
            //     technologies: []
            // },
            search_tags: [],
            filter_tags: [],
            excluded_tags: []
        }
    }

    /**
     * Called when user clicks search icon
     *  parent class processes all selected tags
     * @param {*} e event
     */
    filter(e) {
        const title = document.getElementById('project-title');
        const course = document.getElementsByClassName('course-search')[0];
        const language = document.getElementsByClassName('language-search')[0];

        // const options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() }, body: JSON.stringify(this.state.search_tags) };
        // fetch(`${config.apiUrl}/api/...`, options)
        //     .then(response => { return response.json() })
        //     .then(filtered_posts => {
        //         // set initial posts and filtered posts in groupList to filtered_post
        //     })
        //     .catch(err => { console.log(err) });
        let appendSwitch = document.getElementById('append-switch');
        if (this.state.filter_tags.length !== 0 || this.state.excluded_tags.length !== 0) {
            this.props.addTags(this.state.filter_tags, this.state.excluded_tags, appendSwitch.checked);   // parent class processes selected tags
        }

        // reset search
        // title.value = '';
        // leader.value = '';
        // course.value = '';
        // language.value = '';
        // appendSwitch.checked = false;
        // this.setState({ filter_tags: [], excluded_tags: [], search_tags: [] });
        this.reset();
    }

    /**
     * When enter is pressed, add keyword input as a tag
     *  Called by keyword input box
     * @param {*} e event
     */
    addKeyWord(e) {
        if (e.key === 'Enter') {
            let keyword = e.target.value;
            // non empty and length > 1 keyword
            if (keyword.length > 1 && !(/^(\s+|)$/.test(keyword))) {
                if (e.target.id === 'keyword-input-false') this.addTag(keyword);
                else this.addExcludedTag(keyword);
            }
            e.target.value = '';
        }
    }

    addSearchTag(tag) {
        let tags = this.state.search_tags;
        tag = tag.toLowerCase();
        // add unique tags
        if (this.state.search_tags.indexOf(tag) === -1) {
            tags.push(tag);
            this.setState({ search_tags: tags });
        }
    }

    /**
     * Adds tags to selected tags
     * @param {*} tag 
     */
    addTag(tag) {
        let tags = this.state.filter_tags;
        tag = tag.toLowerCase();
        // add unique tags
        if (tags.indexOf(tag) === -1) {
            tags.push(tag);
            this.setState({ filter_tags: tags });
        }
    }

    /**
     * Adds tags to excluded tags
     * @param {*} tag 
     */
    addExcludedTag(tag) {
        let tags = this.state.excluded_tags;
        tag = tag.toLowerCase();
        // add unique tags
        if (tags.indexOf(tag) === -1) {
            tags.push(tag);
            this.setState({ excluded_tags: tags });
        }
    }

    /**
     * Remove tags from selected tags
     * @param {*} e event
     */
    removeTag(e) {
        let tags = this.state.filter_tags;
        const tagIndex = tags.indexOf(e.target.value);
        if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ filter_tags: tags });
        }
    }

    /**
     * Remove tags from excluded tags
     * @param {*} e event
     */
    removeExcludedTag(e) {
        let tags = this.state.excluded_tags;
        const tagIndex = tags.indexOf(e.target.value);
        if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ excluded_tags: tags });
        }
    }

    removeSearchTag(e) {
        let tags = this.state.search_tags;
        const tagIndex = tags.indexOf(e.target.value);
        if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ search_tags: tags });
        }
    }

    onKeyPress(e) {
        if (e.key === 'Enter') {
            this.addSearchTag(e.target.value);
            document.getElementById(e.target.id).value = '';
        }
    }

    /**
     * Clear advanced search form
     * @param {*} e event
     */
    reset() {
        Array.from(document.getElementsByClassName('advanced-input')).forEach(input => {
            input.value = '';
        });
        document.getElementById('append-switch').checked = false;
        this.setState({ filter_tags: [], excluded_tags: [], search_tags: [] });
    }

    keywordTagComponent(excluded = false) {
        return (
            <div className="input-group bg-dark shadow-sm rounded">
                <input type="text" id={'keyword-input-' + excluded} className="form-control bg-dark border-0 shadow-sm rounded advanced-input" style={{ 'color': 'white', 'fontSize': '14px' }} placeholder="Enter Keyword(s)" onKeyPress={this.addKeyWord.bind(this)}></input>
                <div className="input-group-append">
                    <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                </div>
            </div>
        );
    }

    /**
     * Shows advanced search component 
     */
    render() {
        return (
            <div id="advancedSearch" className="card shadow-sm border-0">
                <div className="card-body">    {/* d-flex flex-column */}
                    <h4 className="card-title text-muted p-1 mb-4"> Advanced Search </h4>

                    <div>
                        <h6 className="mb-3">Search Posts By {'<Under Construction>'} </h6>
                        <SearchBy addTag={this.addSearchTag.bind(this)} onEnter={this.onKeyPress.bind(this)} />
                    </div>

                    <hr className="mt-5" />

                    {/* Show Tags */}
                    <div className="card-footer rounded mb-5 border-0 shadow-sm">
                        <TagList label='Search Tags' list={this.state.search_tags} badge='badge-success' removeTag={this.removeSearchTag.bind(this)} />
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                        <h6 className="">Then Filter By Tags</h6>
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input my-auto" value="false" id="append-switch"></input>
                            <label className="custom-control-label text-muted my-auto" htmlFor="append-switch">Append</label>
                        </div>
                    </div>

                    {/* Tag input fields */}
                    <div>
                        <TagSearch label='Languages' content={<LanguageSearch id='language-tag' processTag={this.addTag.bind(this)} />} />
                        <TagSearch label='Courses' content={<CourseSearch id='course-tag' processTag={this.addTag.bind(this)} />} />
                        <TagSearch label='Programming Languages' content={<ProgrammingLanguageSearch id='planguage-tag' processTag={this.addTag.bind(this)} />} />
                        <TagSearch label='Keywords' content={this.keywordTagComponent()} />
                        <TagSearch label='Excluded Keywords' content={this.keywordTagComponent(true)} />
                    </div>

                    <hr className="mt-5" />

                    {/* Show tags */}
                    <div>
                        <div className="card-footer rounded mb-3 border-0 shadow-sm">
                            <TagList label='Filter Tags:' list={this.state.filter_tags} badge='badge-success' removeTag={this.removeTag.bind(this)} />
                        </div>

                        <div className="card-footer rounded mb-5 border-0 shadow-sm">
                            <TagList label='Excluded Tags:' list={this.state.excluded_tags} badge='badge-danger' removeTag={this.removeExcludedTag.bind(this)} />
                        </div>
                    </div>

                    {/* Search button to filter posts according to user input */}
                    <div className="d-flex justify-content-between">
                        <button className="text-muted bg-transparent border-0 my-auto" style={{ 'outline': '0' }} onClick={this.reset.bind(this)}>Reset</button>
                        <button className="bg-transparent border-0" style={{ 'fontSize': '25px', 'outline': 'none' }} onClick={this.filter.bind(this)}><b className="fa fa-search"></b></button>
                    </div>
                </div>
            </div>
        );
    }
}


function TagList(props) {
    return (
        <div>
            <i className="mr-4 p-1 text-muted"> {props.label} </i>
            <div className="tags">
                {
                    props.list.map((tag) => {
                        return (
                            <span className={`badge badge-pill ${props.badge} p-2 mx-1 my-2`} key={tag}>
                                {tag}
                                <button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={tag} style={{ 'outline': 'none' }} onClick={props.removeTag}></button>
                            </span>
                        );
                    })
                }
            </div>
        </div>
    );
}

/**
 * Shows tag search filter in advanced search component
 * @param {*} props 
 */
function TagSearch(props) {
    return (
        <div className="row mb-3">
            <div className="col-lg-4 bg-transparent border-0 text-muted my-auto" style={{ 'wordBreak': 'keep-all', 'fontSize': '14px' }}>{props.label}</div>
            <div className="col-lg-8 my-auto"> {props.content} </div>
        </div>
    );
}

/**
 * Shows components for initial filter
 * @param {*} props 
 */
function SearchBy(props) {
    return (
        <div className="mb-5" style={{ 'fontSize': '14px' }}>
            <div className="d-flex align-items-center row mb-3">
                <div className="col-lg-4 bg-transparent border-0 text-muted" style={{ 'wordBreak': 'keep-all' }}>Project Title</div>

                <div className="col-lg-8">
                    <input type='text' id='project-title' className="form-control bg-dark border-0 shadow-sm rounded advanced-input my-auto" style={{ 'color': 'white', 'fontSize': '14px' }} placeholder="Enter Project Title" onKeyPress={props.onEnter}></input>
                </div>
            </div>

            <div className="d-flex align-items-center row mb-3">
                <div className="col-lg-4 bg-transparent border-0 text-muted" style={{ 'wordBreak': 'keep-all' }}>Course</div>
                <div className="col-lg-8">
                    <CourseSearch id='course-filter' processTag={props.addTag} />
                </div>
            </div>
            
            <div className="d-flex align-items-center row mb-3">
                <div className="col-lg-4 bg-transparent border-0 text-muted" style={{ 'wordBreak': 'keep-all' }}>Language</div>
                <div className="col-lg-8">
                    <LanguageSearch id='language-filter' processTag={props.addTag} />
                </div>
            </div>

            <div className="d-flex align-items-center row mb-3">
                <div className="col-lg-4 bg-transparent border-0 text-muted" style={{ 'wordBreak': 'keep-all' }}>Programming Language</div>
                <div className="col-lg-8">
                    <ProgrammingLanguageSearch id='planguage-filter' processTag={props.addTag} />
                </div>
            </div>
        </div>
    );
}

export default AdvancedSearch;