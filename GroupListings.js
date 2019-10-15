import React from 'react';

/**
 * Search bar that filters and shows group postings
 */
class GroupListings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPosts: [],   // all post information   title, description, skills requirements   to filter for key words     time start end dates  number of members  etc for advanced
            filteredPosts: []           // posts to be shown
        };
    }

    /**
     * Initialisation when this component is first loaded into the page
     *  Fetches all posts
     */
    componentDidMount() {
        // let posts = fetch(/api) ....
        this.setState({
            initialPosts: [    
                {
                    "title": "Test1",
                    "description": "to ny mad hip log sue",
                    "skills": "python, haskell, prolog"
                },
                {
                    "title": "Test2",
                    "description": "i am the am i 21312312",
                    "skills": "C++, javascript, C, java"
                }
            ],
            filteredPosts: [
                {
                    "title": "Test1",
                    "description": "to ny mad hip log sue",
                    "skills": "python, haskell, prolog"
                },
                {
                    "title": "Test2",
                    "description": "i am the am i 21312312",
                    "skills": "C++, javascript, C, java"
                }
            ]
        });
    }

    /**
     * Filters all posts by the user input
     * @param {*} e event
     */
    filterPosts(e) {
        let posts = this.state.initialPosts;
        posts = posts.filter((post) => {
            let filter = e.target.value.toLowerCase();
            return post['title'].toLowerCase().indexOf(filter) !== -1 ||
                post['description'].toLowerCase().indexOf(filter) !== -1 ||
                post['skills'].toLowerCase().indexOf(filter) !== -1;
        });
        this.setState({
            filteredPosts: posts
        });
    }

    /**
     * Shows this component
     */
    render() {
        return (
            <div>
                <div className="input-group mb-5">
                    <input type="text" className="form-control bg-transparent border p-4" placeholder="Filter Posts" onChange={this.filterPosts.bind(this)}></input>
                    <div className="input-group-append">
                        <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search"></b></div>
                    </div>
                </div>
                <ShowPosts posts={this.state.filteredPosts} />
            </div>
        );
    }
}

/**
 * Shows each filtered post onto the page
 * @param {*} props 
 */
function ShowPosts(props) {
    return (
        //TODO replace with html for group posts 
        <ul className="list-group">
        {
            props.posts.map((post) => {
                return <li className="list-group-item mb-3" key={post['title']}>{post['title']}<br/>{post['description']}<br/>{post['skills']}</li>
            })
        }
        </ul>
    );
}

export default GroupListings;