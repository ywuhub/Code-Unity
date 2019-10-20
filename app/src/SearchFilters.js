import React from 'react';
const API_URL = 'http://localhost:8080'

/**
 * Search bar to filter and show a list of possible tags (courses, programming languages, project classification e.g. mahcine learning, etc)
 *  Parent class
 */
class TagSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            filteredTags: [],
        };
    }

    /**
     * Initialisation when this component is first loaded into the page
     *  Fetches all courses 
     */
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(API_URL + this.props.apiEndpoint)
            .then(response => { return response.json(); })
            .then(json => {
                this.setState({ tags: json });
            })
            .catch(err => { console.log(err); });
    }

    /**
     * Filters all courses based on user input
     * @param {*} e event
     */
    filter(e) {
        let tags = this.state.tags;
        let filter = e.target.value.toLowerCase();

        tags = this.props.filter(tags, filter);

        this.setState({ filteredTags: tags });
    }

    /**
     * Sets search bar to selected course and Clears dropdown course options
     * @param {*} e event
     */
    onCourseSelect(e) {
        this.setState({ filteredTags: [] });
        const tag = (this.props.parent === 'course') ? e.target.innerHTML.split(' ')[0] : e.target.innerHTML;
        this.props.addTag(tag);
        document.getElementById(this.props.searchID).value = '';
    }

    /**
     * Listens for course searchbar key press
     *  sets text in search bar to the first selectable course when enter is pressed
     * @param {*} e event
     */
    onKeyPress(e) {
        if (e.key === 'Enter' && this.state.filteredTags.length > 0) {
            this.setState({ filteredTags: [] });
            const tag = (this.props.parent === 'course') ? this.props.tagValue(this.state.filteredTags[0]).split(' ')[0] : this.props.tagValue(this.state.filteredTags[0]);
            this.props.addTag(tag);
            document.getElementById(this.props.searchID).value = '';
        }
    }

    /**
     * Shows component
     */
    render() {
        let tags = this.state.filteredTags;
        let buttonStyle = { 'borderRadius': '0px', 'textAlign': 'left', 'color': '#aaa', 'borderColor': '#aaa', 'overflowX': 'hidden' };
        let count = 0;

        return (
            <div className="form-control p-0 border-0" style={{ 'position': 'relative' }}>
                {/* search bar */}
                <div className="input-group bg-dark shadow-sm" style={{ 'borderRadius': '5px' }}>
                    <input type="text" id={this.props.searchID} className="form-control bg-transparent border-0" style={{ 'borderRadius': '5px', 'color': 'white', 'fontSize': '14px' }} placeholder={this.props.searchPlaceholder} onChange={this.filter.bind(this)} onKeyPress={this.onKeyPress.bind(this)}></input>
                    <div className="input-group-append">
                        <div className="input-group-text bg-transparent border-0"><b className="fa fa-search"></b></div>
                    </div>
                </div>

                {/* dropdown for seach bar */}
                <div className="btn-group-vertical" style={{ 'borderRadius': '0px', 'position': 'absolute', 'zIndex': '1', 'width': '100%' }}>
                    {
                        tags.map((tag) => {
                            return <button type="button" className="btn btn-primary" style={buttonStyle} key={this.props.tagValue(tag) + ' ' + count++} onClick={this.onCourseSelect.bind(this)}>{this.props.tagValue(tag)}</button>
                        })
                    }
                </div>
            </div>
        );
    }
}

/**
 * Course Search Component
 * @param {*} props 
 */
function CourseSearch(props) {
    /**
     * Get courses matching the filter (user input)
     * @param {*} tags      courses
     * @param {*} filter    user search input
     */
    function filterCourses(tags, filter) {
        // no courses shown for whitespace/empty, input length < 3, input starts with COM/COMP
        let tags_ = tags;
        if (/^(\s+|)$/.test(filter) || filter.length < 3 || /^(COM|COMP)$/i.test(filter)) {
            tags_ = [];

        } else {
            tags_ = tags_.filter((tag) => {
                let course = tag['code'].toLowerCase() + ' ' + tag['name'].toLowerCase();
                return course.indexOf(filter) !== -1;
            });
        }
        return tags_;
    }

    function toString(tag) {
        return tag['code'] + ' ' + tag['name'];
    }

    return (
        <TagSearch apiEndpoint='/api/course_list' filter={filterCourses} addTag={props.addTag} tagValue={toString} searchID='course-search' parent='course' searchPlaceholder='Search Course' />
    );
}

/**
 * Language Search Component
 * @param {*} props 
 */
function LanguageSearch(props) {
    function filterLanguages(tags, filter) {
        // no languages shown for whitespace/empty
        let tags_ = tags;
        if (/^(\s+|)$/.test(filter)) {
            tags_ = [];

        } else {
            tags_ = tags_.filter((tag) => {
                let language = tag.toLowerCase();
                return language.startsWith(filter);
            });
        }
        return tags_;
    }

    function toString(tag) {
        return tag;
    }

    return (
        <TagSearch apiEndpoint='/api/programming_languages' filter={filterLanguages} addTag={props.addTag} tagValue={toString} searchID='language-search' parent='p-lang' searchPlaceholder='Search Language' />
    );
}

export { LanguageSearch, CourseSearch };