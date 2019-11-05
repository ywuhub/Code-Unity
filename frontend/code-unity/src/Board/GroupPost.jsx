import React from 'react';
import config from 'config';
import { authHeader } from '@/_helpers';

function nameClicked(e) {
    const projects_options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() } };
    fetch(`${config.apiUrl}` + '/api/user/' + e.target.id + '/profile', projects_options)
        .then(response => { return response.json() })
        .then(profile => {
            console.log(profile);
        })
        .catch(err => { console.log(err); });
}

function ShowMembers(props) {
    let post = props.post;
    return (
        <span>
            <i class="fas fa-user-friends"></i> <b>Members:</b> <button className="user bg-transparent border-0 p-0" id={post['leader']} onClick={nameClicked}>{post['leader']}</button>
            {post['members'] && post['members'].length > 1 && ', '}
            {post['members'] &&
                Array.from(post['members']).filter((member) => { return member !== post['leader'] }).map((member) => {
                    return <button className="user bg-transparent border-0 p-0" key={member} id={member} onClick={nameClicked}>{member}</button>;
                })
            }
        </span>
    );
}

function GroupPost(props) {
    const post = props.post;
    // languages, technologies, tags, course
    const group_full = (post['cur_people'] === post['max_people']);
    if (group_full && props.hidePosts) return (<div></div>);
    return (
        <div class="media text-muted pt-3">
            <svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
            <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                {/* header */}
                <div className="d-flex justify-content-between w-100">
                    <h6><strong className="text-dark">{post['title']} </strong></h6>
                    <div><i className="fas fa-users"></i> <b>{post['cur_people']} / {post['max_people']}</b> <br /> {!group_full && <a href="#" className="d-flex justify-content-end"> Join </a>}{group_full && <span className="d-flex justify-content-end"> Full </span>} </div>
                </div>

                {/* details (members, course, language spoken, tags) */}
                <div className="d-flex flex-column">
                    <ShowMembers post={post} />
                    <span><i class="fas fa-book-reader"></i> &nbsp;<b>Course:</b> {post['course']}</span>
                    <span><i class="fas fa-language"></i> <b>Language:</b> {post['languages'] && Array.from(post['languages']).join(', ')}</span>
                    <span>
                        <i class="fas fa-tags"></i> <b>Tags: </b>
                        {post['tags'] &&
                            post['tags'].map((tag, index) => {
                                return <span className="badge badge-pill badge-secondary p-1 mr-1" key={index}> {tag} </span>;
                            })
                        }
                    </span>
                </div>

                {/* post description */}
                <div className="py-3">
                    <i>{post['description']}</i>
                </div>

                {/* technologies */}
                <div>
                    {post['technologies'] &&
                        post['technologies'].map((technology, index) => {
                            return <span className="badge badge-primary p-1 mr-1" key={index}> {technology} </span>;
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default GroupPost;