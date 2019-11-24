import React from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import { authenticationService } from '@/_services';

function ShowMembers(props) {
    let post = props.post;
    const curr_id = authenticationService.currentUserValue.uid;
    return (
        <span>
            <i className="fas fa-user-friends"></i> <b>Members:&nbsp;</b> 
            {(curr_id === post['leader']._id && <Link to='/profile' style={{ 'textDecoration': 'none' }}>{post['leader'].username}</Link>) ||
                <Link to={{ pathname: "/profile-" + post['leader'].username, state: { _id: post['leader']._id, username: post['leader'].username } }} id={post['leader']._id} style={{ 'textDecoration': 'none' }}>{post['leader'].username}</Link>
            }
            {post['members'] && post['members'].length > 1 && ', '}
            {post['members'] &&
                Array.from(post['members']).filter((member) => { return member.username !== post['leader'].username }).map((member, index) => {
                    return (
                        <span key={member._id}>
                            {(curr_id === member._id && <Link to='/profile' style={{ 'textDecoration': 'none' }}>{member.username}</Link>) ||
                                <Link to={{ pathname: "/profile-" + member.username, state: { _id: member._id, username: member.username } }} id={member._id} style={{ 'textDecoration': 'none' }}>{member.username}</Link>
                            }
                            {index !== post['members'].length - 2 && <span>,&nbsp;</span>}
                        </span>
                    )
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
        <div className="media text-muted pt-3">
            <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
            <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                {/* header */}
                <div className="d-flex justify-content-between w-100">
                    <h6><strong className="text-dark">{post['title']} </strong></h6>
                    <div><i className="fas fa-users"></i> <b>{post['cur_people']} / {post['max_people']}</b> <br /> {<Link to={{ pathname: "/group-" + post['project_id'], state: { _id: post['project_id'] } }} style={{ 'textDecoration': 'none' }}> View Group </Link>}</div>
                </div>

                {/* details (members, course, language spoken, tags) */}
                <div className="d-flex flex-column">
                    <ShowMembers post={post} />
                    <span><i className="fas fa-book-reader"></i> &nbsp;<b>Course:</b> {post['course']}</span>
                    <span><i className="fas fa-language"></i> <b>Language:</b> {post['languages'] && Array.from(post['languages']).join(', ')}</span>
                    <span>
                        <i className="fas fa-tags"></i> <b>Tags: </b>
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
