import React from 'react';
import { LanguageSearch, CourseSearch } from './SearchFilters';

/**
 * Advanced Search component
 *  Contains input/search boxes for user input
 *  Keeps track of all tags inputted by the user
 */
class AdvancedSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_tags: []
        }
    }

    /**
     * Called when user clicks search icon
     *  parent class processes all selected tags
     * @param {*} e event
     */
    filter(e) {
        const title = document.getElementById('project-title');
        const leader = document.getElementById('project-leader');
        let appendSwitch = document.getElementById('append-switch');

        // parent class processes project title and project leader input 
        if (!(/^(\s+|)$/.test(title.value))) this.props.filterByKey('title', title.value);
        //if (/^(\s+|)$/.test(leader.value)) this.props.filterByKey('leader', leader.value);

        const tags = this.state.selected_tags;
        const append = appendSwitch.checked;
        if (tags.length !== 0) {
            this.props.addTags(tags, append);   // parent class processes selected tags
        }

        // reset search
        title.value = '';
        leader.value = '';
        appendSwitch.checked = false;
        this.setState({ selected_tags: [] });
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
                this.addTag(keyword);
            }
            e.target.value = '';
        }
    }

    /**
     * Adds tags to selected tags
     * @param {*} tag 
     */
    addTag(tag) {
        let tags = this.state.selected_tags;
        tag = tag.toLowerCase();
        // add unique tags
        if (tags.indexOf(tag) === -1) {
            tags.push(tag);
            this.setState({ tags: tags });
        }
    }

    /**
     * Remove tags from selected tags
     * @param {*} e event
     */
    removeTag(e) {
        let tags = this.state.selected_tags;
        const tagIndex = tags.indexOf(e.target.value);
        if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ tags: tags });
        }
    }

    /**
     * Clear advanced search form
     * @param {*} e event
     */
    reset(e) {
        Array.from(document.getElementsByClassName('advanced-input')).forEach(input => {
            input.value = '';
        });
        document.getElementById('append-switch').checked = false;
        this.setState({ selected_tags: [] });
    }
    
    /**
     * Shows advanced search component 
     */
    render() {
        let keywordInput = (
        <div className="input-group bg-dark shadow-sm rounded">
            <input type="text" id="keyword-input" className="form-control bg-dark border-0 shadow-sm rounded advanced-input" style={{ 'color': 'white' }} placeholder="Enter Keyword(s)" onKeyPress={this.addKeyWord.bind(this)}></input>
            <div className="input-group-append">
                <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
            </div>
        </div>
        );

        return (
            <div id="advancedSearch" className="collapse card border shadow">
                <div className="card-body bg-light">
                    <h3 className="card-title text-muted p-1 mb-4"> Advanced Search </h3>
                    <h5 className="mb-3">Search Posts By {'<Under Construction>'} </h5> 
                    {/* project title and leader search */}
                    <SearchBy />

                    {/* search filers for courses and progamming languages, and input box for user specified keyword tags*/}
                    <div className="d-flex justify-content-between mb-3">
                        <h5 className="my-auto">Then Filter By Tags</h5> 
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input my-auto" value="false" id="append-switch"></input>
                            <label className="custom-control-label text-muted mb-2 my-auto" htmlFor="append-switch">Append</label>
                        </div>
                    </div>
                    <TagComponent label='Courses' content={<CourseSearch processTag={this.addTag.bind(this)} />} />
                    <TagComponent label='Programming Languages' content={<LanguageSearch processTag={this.addTag.bind(this)} />} />
                    <TagComponent label='Keywords' content={keywordInput} />
                    <TagComponent label='Excluded Keywords <Under Construction>' content={keywordInput} />

                    <hr className="mt-5"/>

                    {/* Component showing all tags */}
                    <div className="card-footer rounded mt-4 mb-5 border shadow-sm">
                        <i className="mr-4 p-1 text-muted"> Selected Tags:</i>
                        <div id="tags">
                            {
                                this.state.selected_tags.map((tag) => {
                                    return (
                                        <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={tag}>
                                            {tag}
                                            <button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={tag} style={{ 'outline': 'none' }} onClick={this.removeTag.bind(this)}></button>
                                        </span>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className="card-footer rounded mt-4 mb-5 border shadow-sm">
                        <i className="mr-4 p-1 text-muted"> Excluded Tags: {'<Under Construction>'}</i>
                        <div id="tags">
                            {
                                this.state.selected_tags.map((tag) => {
                                    return (
                                        <span className="badge badge-pill badge-success p-2 mx-1 my-2" key={tag}>
                                            {tag}
                                            <button className="fa fa-times bg-transparent border-0 p-0 pl-1" value={tag} style={{ 'outline': 'none' }} onClick={this.removeTag.bind(this)}></button>
                                        </span>
                                    );
                                })
                            }
                        </div>
                    </div>

                    {/* Search button to filter posts according to user input */}
                    <div className="d-flex justify-content-between">
                        <button className="text-muted bg-transparent border-0 my-auto" style={{'outline':'0'}} onClick={this.reset.bind(this)}>Reset</button>
                        <button className="bg-transparent border-0" style={{ 'fontSize': '25px', 'outline': 'none' }} onClick={this.filter.bind(this)}><b className="fa fa-search"></b></button>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Shows tag search filter in advanced search component
 * @param {*} props 
 */
function TagComponent(props) {
    return (
        <div className="row mb-3">
            <div className="col-lg-4 bg-transparent border-0 text-muted my-auto" style={{ 'wordBreak': 'keep-all'}}>{props.label}</div>
            <div className="col-lg-8 my-auto"> {props.content} </div>
        </div>
    );
}

/**
 * Shows input boxes for project title and project leader for searching
 * @param {*} props 
 */
function SearchBy(props) {
    return (
        <div className="mb-5">
            <div className="d-flex align-items-center row mb-3">
                <div className="col-lg-4 bg-transparent border-0 text-muted my-auto" style={{ 'wordBreak': 'keep-all' }}>Project Title</div>

                <div className="col-lg-8">
                    <input type='text' id='project-title' className="form-control bg-dark border-0 shadow-sm rounded advanced-input my-auto" style={{ 'color': 'white' }} placeholder="Enter Project Title"></input>
                </div>
            </div>

            <div className="d-flex align-items-center row mb-3">
                <div className="col-lg-4 bg-transparent border-0 text-muted my-auto" style={{ 'wordBreak': 'keep-all' }}>Project Leader</div>
                <div className="col-lg-8">
                    <input type='text' id='project-leader' className="form-control bg-dark border-0 shadow-sm rounded advanced-input my-auto" style={{ 'color': 'white' }} placeholder="Enter Project Leader"></input>
                </div>
            </div>
        </div>
    );
}

export default AdvancedSearch;