import React from 'react';

// class AdvancedSearch extends React.Component {

// }

/**
 * Search bar to filter and show courses
 */
class CourseSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],   
            filteredCourses: []           
        };
    }

    /**
     * Initialisation when this component is first loaded into the page
     *  Fetches all courses 
     */
    componentDidMount() {
        // let courses = fetch(/api) ....
        this.setState({
            courses: [    
                {
                    "code": "COMP4920",
                    "name": "Ethics and stuff",
                },
                {
                    "code": "COMP3900",
                    "name": "Software thing",
                }
            ]
            // courses not filtered and/or shown until user input
        });
    }

    /**
     * Filters all courses based on user input
     * @param {*} e event
     */
    filterCourses(e) {
        let courses = this.state.courses;
        let filter = e.target.value.toLowerCase();
        // no courses shown for whitespace/empty input
        if (/^(\s+|)$/.test(filter)) {
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
        handleClick(e) {
        this.setState({filteredCourses: []});
        document.getElementById('courseSearch').value = e.target.innerHTML;
    }

    /**
     * Shows this component
     */
    render() {
        let courses = this.state.filteredCourses;
        let buttonStyle = {
            'borderRadius':'0px',
            'textAlign':'left',
            'color':'#aaa',
            'borderColor':'#aaa'
        };
        return (
            <div>
                <div className="input-group mt-5">
                    <input type="text" id="courseSearch" className="form-control bg-transparent border p-4" placeholder="Search Courses" style={{'borderRadius':'0px'}} onChange={this.filterCourses.bind(this)}></input>
                    <div className="input-group-append">
                        <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search"></b></div>
                    </div>
                </div>
                <div className="btn-group-vertical " style={{'borderRadius':'0px', 'width':'100%'}}>
                {
                    courses.map((course) => {
                        return <button type="button" className="btn btn-primary" style={buttonStyle} key={course['code']} onClick={this.handleClick.bind(this)}>{course['code']} {course['name']}</button>
                    })
                }
                </div>
            </div>
        );
    }
}

export default CourseSearch;