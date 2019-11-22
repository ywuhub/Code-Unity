import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';

function cleanTime(ms) {
    const dateTime = new Date(ms).toISOString();
    const arr = dateTime.split('T');
    const date = arr[0];
    const time = arr[1].replace('Z', '').split('.')[0];
    return date + " " + time;
}

function ProjectDeleted(props) {
    const title = props.notification.project_title;
    const time = props.notification.datetime.$date;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="rgb(255, 77, 77)"></rect><text x="50%" y="50%" fill="rgb(255, 77, 77)" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div className="h6">Project <strong>{title}</strong> has been deleted</div>
                    <div style={{'fontSize':'11px'}}>{cleanTime(time)}</div>
                    <div><span className="badge p-2 mt-2" style={{'backgroundColor':'rgb(255, 77, 77)', 'color':'white', 'fontSize':'11px'}}>{props.notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

function UserKicked(props) {
    const notification = props.notification;
    const kicked_user = notification.kicked_user;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    const time = notification.datetime.$date;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div className="h6">
                        <strong><Link to={{ pathname: "/profile-" + kicked_user.username, state: { _id: kicked_user.id.$oid, username: kicked_user.username } }} id={kicked_user.id.$oid} style={{ 'textDecoration': 'none' }}>{kicked_user.username}</Link></strong>
                        &nbsp;has been kicked from project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div style={{'fontSize':'11px'}}>{cleanTime(time)}</div>
                    <div><span className="badge p-2 mt-2" style={{'backgroundColor':'#e83e8c', 'color':'white', 'fontSize':'11px'}}>{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

function UserLeave(props) {
    const notification = props.notification;
    const left_user = notification.left_user;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    const time = notification.datetime.$date;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#00cc99"></rect><text x="50%" y="50%" fill="#00cc99" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div className="h6">
                        <strong><Link to={{ pathname: "/profile-" + left_user.username, state: { _id: left_user.id.$oid, username: left_user.username } }} id={left_user.id.$oid} style={{ 'textDecoration': 'none' }}>{left_user.username}</Link></strong>
                        &nbsp;has left project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div style={{'fontSize':'11px'}}>{cleanTime(time)}</div>
                    <div><span className="badge p-2 mt-2" style={{'backgroundColor':'#00cc99', 'color':'white', 'fontSize':'11px'}}>{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

function UserJoin(props) {
    const notification = props.notification;
    const joined_user = notification.joined_user;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    const time = notification.datetime.$date;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div className="h6">
                        <strong><Link to={{ pathname: "/profile-" + joined_user.username, state: { _id: joined_user.id.$oid, username: joined_user.username } }} id={joined_user.id.$oid} style={{ 'textDecoration': 'none' }}>{joined_user.username}</Link></strong>
                        &nbsp;has joined project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div style={{'fontSize':'11px'}}>{cleanTime(time)}</div>
                    <div><span className="badge p-2 mt-2" style={{'backgroundColor':'#007bff', 'color':'white', 'fontSize':'11px'}}>{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

function JoinRequest(props) {
    const notification = props.notification;
    const requester = notification.requester;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    const time = notification.datetime.$date;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#6f42c1"></rect><text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div className="h6">
                        <strong><Link to={{ pathname: "/profile-" + requester.username, state: { _id: requester.id.$oid, username: requester.username } }} id={requester.id.$oid} style={{ 'textDecoration': 'none' }}>{requester.username}</Link></strong>
                        &nbsp;has requested to join project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div style={{'fontSize':'11px'}}>{cleanTime(time)}</div>
                    <div><span className="badge p-2 mt-2" style={{'backgroundColor':'#6f42c1', 'color':'white', 'fontSize':'11px'}}>{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}
{/* <div><span className="badge badge-primary p-2 mt-2">{notification.type}</span></div> */}
function Invite(props) {
    const notification = props.notification;
    const title = notification.project_title;
    const project_id = notification.project_id.$oid;
    const time = notification.datetime.$date;
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="d-inline-flex">
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#33cccc"></rect><text x="50%" y="50%" fill="#33cccc" dy=".3em">32x32</text></svg>
                <div className="flex-column">
                    <div className="h6">
                        You have been invited to project <strong><Link to={{ pathname: "/group-" + project_id, state: { _id: project_id } }} style={{ 'textDecoration': 'none' }}> {title} </Link></strong>
                    </div>
                    <div style={{'fontSize':'11px'}}>{cleanTime(time)}</div>
                    <div><span className="badge p-2 mt-2" style={{'backgroundColor':'#33cccc', 'color':'white', 'fontSize':'11px'}}>{notification.type}</span></div>
                </div>
            </div>
            <button className="d-flex align-content-end btn" onClick={props.dismiss}><i className="fas fa-times"></i></button>
        </div>
    )
}

export { JoinRequest, Invite, UserJoin, UserLeave, UserKicked, ProjectDeleted }