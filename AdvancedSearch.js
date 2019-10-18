import React from 'react';
const API_URL = 'http://localhost:8080'

/**
 * Search bar to filter and show courses
 */
class CourseSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            filteredCourses: [],
        };
    }

    /**
     * Initialisation when this component is first loaded into the page
     *  Fetches all courses 
     */
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(API_URL + '/api/course_list')
            .then(response => { return response.json(); })
            .then(json => {
                this.setState({ courses: json });
            })
            .catch(err => { console.log(err); });
    }

    /**
     * Filters all courses based on user input
     * @param {*} e event
     */
    filterCourses(e) {
        let courses = this.state.courses;
        let filter = e.target.value.toLowerCase();
        // no courses shown for whitespace/empty, input length < 3, input starts with COM/COMP
        if (/^(\s+|)$/.test(filter) || filter.length < 3 || /^(COM|COMP)$/i.test(filter)) {
            courses = [];

        } else {
            courses = courses.filter((course) => {
                let codeName = course['code'].toLowerCase() + ' ' + course['name'].toLowerCase();
                return codeName.indexOf(filter) !== -1;
            });
        }

        this.setState({
            filteredCourses: courses
        });
    }

    /**
     * Sets search bar to selected course and Clears dropdown course options
     * @param {*} e event
     */
    onCourseSelect(e) {
        this.setState({ filteredCourses: [] });
        document.getElementById('courseSearch').value = e.target.innerHTML;
    }

    /**
     * Listens for course searchbar key press
     *  sets text in search bar to the first selectable course when enter is pressed
     * @param {*} e event
     */
    onKeyPress(e) {
        if (e.key === 'Enter' && this.state.filteredCourses.length > 0) {
            document.getElementById('courseSearch').value = this.state.filteredCourses[0]['code'] + ' ' + this.state.filteredCourses[0]['name'];
            this.setState({ filteredCourses: [] });
        }
    }

    /**
     * Shows component
     */
    render() {
        let courses = this.state.filteredCourses;
        let buttonStyle = {
            'borderRadius': '0px',
            'textAlign': 'left',
            'color': '#aaa',
            'borderColor': '#aaa',
            'overflowX':'hidden'
        };
        return (
            <div style={{ 'position': 'relative' }}>
                <div className="input-group bg-dark shadow-sm" style={{'borderRadius':'5px'}}>
                    <input type="text" id="courseSearch" className="form-control bg-transparent p-4 pr-5 border-0" style={{'borderRadius':'5px', 'color':'white'}} placeholder="Search Courses" onChange={this.filterCourses.bind(this)} onKeyPress={this.onKeyPress.bind(this)}></input>
                    <div className="input-group-append">
                        <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search"></b></div>
                    </div>
                </div>

                <div className="btn-group-vertical" style={{ 'borderRadius': '0px', 'width': '100%', 'position': 'absolute', 'zIndex': '1' }}>
                {
                    courses.map((course) => {
                        return <button type="button" className="btn btn-primary" style={buttonStyle} key={course['code']} onClick={this.onCourseSelect.bind(this)}>{course['code']} {course['name']}</button>
                    })
                }
                </div>
            </div>
        );
    }
}



export default CourseSearch;