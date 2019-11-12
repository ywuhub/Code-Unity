import React from 'react';
import { SkillBox } from '@/WebComponents';
import { Route, Link, Switch } from 'react-router-dom';
import '@/Style';

export const GroupPage = (props) => {
    let key_id = props.key_id_outer;
    let leader = props.data.leader;
    let members = props.data.members;

    return (
        <div className="container-fluid pl-4">
            <div className="row mt-2 d-flex justify-content-between flex-wrap">
                <h4 className="h1">{props.data.title}</h4>
            </div>
            <div className="row mt-4 border-bottom border-grey">
                <div className="col-9">
                    <div className="row">
                        <p>Leader:&nbsp;</p>
                        <p><Link to={{ pathname: "/profile-" + leader.username, state: { _id: leader._id, username: leader.username } }} id={leader._id} style={{ 'textDecoration': 'none' }}>{leader.username}</Link></p>
                    </div>
                    <div className="row">
                        <p>Members:&nbsp;</p>
                        <p>
                            {
                                members.filter((member) => { return member.username !== props.data.leader.username }).map((member, index) => {
                                    return (
                                        <span key={member._id}>
                                            <Link to={{ pathname: "/profile-" + member.username, state: { _id: member._id, username: member.username } }} id={member._id} style={{ 'textDecoration': 'none' }}>{member.username}</Link>
                                            {index !== members.length - 2 && <span>,&nbsp;</span>}
                                        </span>
                                    )
                                })
                            }
                        </p>
                    </div>
                </div>
                <div className="col-3 group-page-member-setting text-left">
                    <div className="row">
                        <p className="d-block text-gray-dark"> Member number:</p>
                        <p className="d-block text-gray-dark">{props.data.cur_people}</p>
                    </div>
                    <div className="row">
                        <p className="d-block text-gray-dark">max: </p>
                        <p className="d-block text-gray-dark">{props.data.max_people}</p>
                    </div>
                </div>
            </div>

            <div className="row mt-4 border-bottom border-grey">
                <div className="col-12">
                    <h6 className="row h6">About This Group</h6>
                    <p className="row pt-2">{props.data.description}</p>
                </div>
            </div>
            {props.data.course &&
                <div className="row mt-3 border-bottom border-grey">
                    <div className="col-12 row">
                        <p>Courses:</p>
                        <p>{props.data.course}</p>
                    </div>
                </div>
            }
            <div className="row container pt-3 pl-0">
                <SkillBox keyValue={key_id++} title="Programming languages" data={props.data.technologies} />
                <SkillBox keyValue={key_id++} title="languages" data={props.data.languages} />
                <SkillBox keyValue={key_id++} title="tags" data={props.data.tags} />
            </div>
        </div>
    );
};
