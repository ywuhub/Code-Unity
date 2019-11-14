import React from 'react';
import { SkillBox } from '@/WebComponents';
import '@/Style';

export const GroupPage = (props) => {
        let key_id = props.key_id_outer;
    return(
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h4 ml-2">My Group</h1>
                    {props.isEditable&&
                        <a href={"/mygroup/edit/"+props.data.project_id}>
                            <button type="button" className="btn btn-sm btn-outline-secondary">Edit Group</button>
                        </a>
                    }
                </div>

                <div className="container-fluid pl-4">
                    <div className="row mt-2 d-flex justify-content-between flex-wrap">
                        <h4 className="h1">{props.data.title}</h4>
                    </div>
                    <div className="row mt-4 border-bottom border-grey">
                        <div className="col-9">
                            <div className="row">
                                <p>Leader: </p>
                                <p>{props.data.leader}</p>
                            </div>
                            <div className="row">
                                <p>Member: </p>
                            </div>
                                {
                                   (props.data.members || []).map((member) => {
                                    return(
                                        <div key={key_id++} div className="row ml-1">
                                            <p>{member}</p>
                                        </div>
                                        )
                                    }) 
                                }
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
                        <SkillBox keyValue={key_id++} title="Programming languages" data={props.data.technologies }/>
                        <SkillBox keyValue={key_id++} title="languages" data={ props.data.languages }/>
                        <SkillBox keyValue={key_id++} title="tags" data={ props.data.tags }/>
                    </div>
                </div>
            </div>
    );
};
