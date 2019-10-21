import React from 'react';
import { LanguageSearch, CourseSearch } from './SearchFilters';

function SearchBy(props) {
    return (
        <div className="mb-4">

            <div className="d-flex align-items-center row mb-2">
                <div className="col-sm-3 bg-transparent border-0 text-muted" style={{ 'minWidth': '100%', 'wordBreak': 'keep-all' }}>Project Title</div>
                <div className="col-sm-9" style={{ 'minWidth': '100%' }}>
                    <input type='text' id='project-title' className="form-control bg-dark border-0 shadow-sm rounded" style={{ 'color': 'white' }} placeholder="Enter Project Title"></input>
                </div>
            </div>

            <div className="d-flex align-items-center row mb-2">
                <div className="col-sm-3 bg-transparent border-0 text-muted" style={{ 'minWidth': '100%', 'wordBreak': 'keep-all' }}>Project Leader</div>
                <div className="col-sm-9" style={{ 'minWidth': '100%' }}>
                    <input type='text' id='project-leader' className="form-control bg-dark border-0 shadow-sm rounded" style={{ 'color': 'white' }} placeholder="Enter Project Leader"></input>
                </div>
            </div>
        </div>
    );
}

/**
 * Advanced Search component
 */
class AdvancedSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_tags: []
        }
    }

    addTag(tag) {
        let tags = this.state.selected_tags;
        tag = tag.toLowerCase();
        // ignore duplicate tags
        if (tags.indexOf(tag) === -1) {
            tags.push(tag);
            this.setState({ tags: tags });
        }
    }

    removeTag(e) {
        let tags = this.state.selected_tags;
        const tagIndex = tags.indexOf(e.target.value);
        if (tagIndex !== -1) {
            tags.splice(tagIndex, 1);
            this.setState({ tags: tags });
        }
    }

    filter(e) {
        const title = document.getElementById('project-title');
        const leader = document.getElementById('project-leader');

        if (!(/^(\s+|)$/.test(title.value))) this.props.filterByKey('title', title.value);
        //if (/^(\s+|)$/.test(leader.value)) this.props.filterByKey('leader', leader.value);
        const tags = this.state.selected_tags;
        if (tags.length !== 0) {
            this.props.addTags(tags);
        }

        // reset adv search
        title.value = '';
        leader.value = '';
        this.setState({ selected_tags: [] });
    }

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

    render() {
        return (
            <div id="advancedSearch" className="collapse card border shadow">
                <div className="card-body bg-light">
                    <h3 className="card-title text-muted p-1 mb-4"> Advanced Search </h3>

                    <SearchBy />

                    <h5 className="">Tags</h5>
                    <TagComponent tagName='Courses' content={<CourseSearch addTag={this.addTag.bind(this)} />} />
                    <TagComponent tagName='Programming Languages' content={<LanguageSearch addTag={this.addTag.bind(this)} />} />
                    <TagComponent tagName='Keywords' content={
                        <div className="input-group bg-dark shadow-sm mb-1" style={{ 'borderRadius': '5px' }}>
                            <input type="text" id="keyword-input" className="form-control bg-dark border-0 shadow-sm rounded" style={{ 'color': 'white' }} placeholder="Enter Keyword" onKeyPress={this.addKeyWord.bind(this)}></input>
                            <div className="input-group-append">
                                <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                            </div>
                        </div>
                    } />

                    option: exclude tags
                    option: append to existing search tags

                    <hr />
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
                    <div className="d-flex justify-content-end">
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
        <div className="d-flex align-items-center row mb-2">
            <div className="col-sm-3 bg-transparent border-0 text-muted" style={{ 'minWidth': '100%', 'wordBreak': 'keep-all' }}>{props.tagName}</div>
            <div className="col-sm-9" style={{ 'minWidth': '100%' }}> {props.content} </div>
        </div>
    );
}

export default AdvancedSearch;