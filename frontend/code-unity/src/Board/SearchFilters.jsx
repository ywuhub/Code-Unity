import React from 'react';
import config from 'config';
import { authHeader } from '@/_helpers';

/**
 * Search bar to filter and show a list of possible tags (courses, programming languages, project classification e.g. mahcine learning, etc)
 *  Parent class
 *  As users type, a list of preset options are shown
 *      users then press enter or click the option to select it
 */
class TagSearch extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            tags: [],
            filteredTags: [],
        };
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }

    /**
     * Initialisation when this component is first loaded into the page
     *  Fetches all options for users to filter through
     */
    componentDidMount() {
        this.isMounted_ = true;
        this.setState({ isLoading: true });
        if (this.props.apiEndpoint !== '') {
            const options = { method:'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} }
            fetch(`${config.apiUrl}` + this.props.apiEndpoint, options)
            .then(response => { return response.json(); })
            .then(json => {
                if (this.isMounted_) this.setState({ tags: json });
            })
            .catch(err => { console.log(err); });
        }
    }

    /**
     * Filters all options based on user input
     * @param {*} e event
     */
    filter(e) {
        let tags = this.state.tags;
        let filter = e.target.value.toLowerCase();

        if (/^(\s+|)$/.test(filter)) {
            this.setState({ filteredTags: [] });
            return;
        }
        tags = this.props.filter(tags, filter); // uses child's filter method

        this.setState({ filteredTags: tags });
    }

    /**
     * Selects option clicked by the user
     *  Child method passed in process the value chosen
     * @param {*} e event
     */
    onTagSelect(e) {
        this.setState({ filteredTags: [] });
        const tag = (this.props.parent === 'course') ? e.target.innerHTML.split(' ')[0] : e.target.innerHTML;
        this.props.processTag(tag); // child processes selection option
        document.getElementById(this.props.searchID).value = '';
    }

    /**
     * Selected first selectable option when user presses enter
     *  Child method passed in processes the value chosen
     * @param {*} e event
     */
    onKeyPress(e) {
        if (e.key === 'Enter' && this.state.filteredTags.length > 0) {
            this.setState({ filteredTags: [] });
            const tag = (this.props.parent === 'course') ? this.props.tagValue(this.state.filteredTags[0]).split(' ')[0] : this.props.tagValue(this.state.filteredTags[0]);
            this.props.processTag(tag); // child processes selected option
            e.target.value = '';
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
            <div className="p-0 border-0" style={{ 'position': 'relative' }}>
                {/* search bar */}
                <div className="input-group bg-dark shadow-sm rounded">
                    <input type="text" id={this.props.searchID} className={"form-control bg-dark border-0 shadow-sm rounded advanced-input " + this.props.searchClass} style={{ 'color': 'white', 'fontSize': '14px' }} placeholder={this.props.searchPlaceholder} onChange={this.filter.bind(this)} onKeyPress={this.onKeyPress.bind(this)}></input>
                    <div className="input-group-append">
                        <div className="input-group-text bg-transparent border-0"><b className="fa fa-search"></b></div>
                    </div>
                </div>

                {/* dropdown for seach bar */}
                <div className="btn-group-vertical" style={{ 'borderRadius': '0px', 'position': 'absolute', 'zIndex': '1', 'width': '100%' }}>
                    {
                        tags.map((tag) => {
                            return <button type="button" className="btn btn-primary" style={buttonStyle} key={this.props.tagValue(tag) + ' ' + count++} onClick={this.onTagSelect.bind(this)}>{this.props.tagValue(tag)}</button>
                        })
                    }
                </div>
            </div>
        );
    }
}

/**
 * Course Search Component
 * @requires function processTag(tag) to be passed in to get/process selected course tag
 * @requires id for input box
 * @param {*} props 
 */
function CourseSearch(props) {
    /**
     * Get courses matching the filter (user input)
     * @param {*} tags      courses
     * @param {*} filter    user search input
     */
    function filterCourses(tags, filter) {
        let tags_ = tags;
        // whitespace/empty input, input length < 3, input starts with COM/COMP     show no options
        if (/^(\s+|)$/.test(filter) || filter.length < 3 || /^(COM|COMP)$/i.test(filter)) {
            tags_ = [];

        // filter through course options based on user input
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
        <TagSearch apiEndpoint='/api/course_list' filter={filterCourses} processTag={props.processTag} tagValue={toString} searchID={props.id} searchClass='course-search' parent='course' searchPlaceholder='Search Course' />
    );
}

/**
 * Language Search Component
 * @requires function processTag(tag) to be passed in to get/process selected language tag
 * @requires id for input box
 * @param {*} props 
 */
function ProgrammingLanguageSearch(props) {
    function filterLanguages(tags, filter) {
        // no languages shown for whitespace/empty
        let tags_ = tags;
        if (/^(\s+|)$/.test(filter)) {
            tags_ = [];

        // filter through programming lagnuage options based on user input
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
        <TagSearch apiEndpoint='/api/programming_languages' filter={filterLanguages} processTag={props.processTag} tagValue={toString} searchID={props.id} searchClass='language-search' parent='p-lang' searchPlaceholder='Search Programming Language' />
    );
}

function LanguageSearch(props) {
    function filterLanguages(tags, filter) {
        let tags_ = tags;
        // no languages for empty/whitespace
        if (/^(\s+|)$/.test(filter)) {
            tags_ = [];

        } else {
            tags_ = tags_.filter((tag) => {
                let language = tag.toLowerCase();
                return language.indexOf(filter) !== -1;
                // return language.startsWith(fitler);
            });
        }
        return tags_;
    }

    function toString(tag) {
        return tag;
    }

    return (
        <TagSearch apiEndpoint='/api/list/languages' filter={filterLanguages} processTag={props.processTag} tagValue={toString} searchID={props.id} searchClass='speaking-language-search' parent='lang' searchPlaceholder='Search Language' />
    );
}

function TechnologySearch(props) {
    function filterTechnologies(tags, filter) {
        let tags_ = tags;
        // no languages for empty/whitespace
        if (/^(\s+|)$/.test(filter)) {
            tags_ = [];

        } else {
            tags_ = tags_.filter((tag) => {
                let technology = tag.toLowerCase();
                return technology.indexOf(filter) !== -1;
                // return language.startsWith(fitler);
            });
        }
        return tags_;
    }

    function toString(tag) {
        return tag;
    }

    return (
        <TagSearch apiEndpoint='/api/list/technologies' filter={filterTechnologies} processTag={props.processTag} tagValue={toString} searchID={props.id} searchClass='technologies-search' parent='technologies' searchPlaceholder='Search Technologies' />
    );
}

export { CourseSearch, ProgrammingLanguageSearch, LanguageSearch, TechnologySearch };