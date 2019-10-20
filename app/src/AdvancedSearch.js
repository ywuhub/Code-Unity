import React from 'react';
import { LanguageSearch, CourseSearch } from './SearchFilters';

/**
 * Advanced Search component
 */
class AdvancedSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: []
        }
    }

    addTag(tag) {
        let tags = this.state.tags;
        // ignore duplicate tags
        if (tag.length > 1 && tags.indexOf(tag) === -1) {
            tags.push(tag.toLowerCase());
            this.setState({ tags: tags });
        }
    }

    // addTags(tags)    forEach   ...   pass to advanced    

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
            <div id="advancedSearch" className="collapse card border shadow">
                <div className="card-body bg-light">
                    <h3 className="card-title text-muted p-1 mb-4"> Advanced Search </h3>
                    <h5 className="">Sort</h5>
                    search by title, project leader

                    <h5 className="">Tags</h5>
                    <TagComponent tagName='Course' content={<CourseSearch addTag={this.addTag.bind(this)} />} />
                    <TagComponent tagName='Programming Language' content={<LanguageSearch addTag={this.addTag.bind(this)} />} />
                    exclude tags

                    <h5 className="">Time and Location</h5>
                    start end date, semester, campus

                    <h5 className="">Options</h5>
                    exact match, inclusive

                    <h5 className="">Sort</h5>
                    sort by date

                    <div className="card-footer rounded my-5 border shadow-sm">
                        <i className="mr-4 p-1 text-muted"> Selected Tags:</i>

                        <div id="tags">
                            {
                                this.state.tags.map((tag) => {
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

                    <h5 className="">Fin Reset</h5>
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