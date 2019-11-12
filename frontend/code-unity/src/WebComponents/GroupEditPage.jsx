import React from 'react';
import { SkillBox } from '@/WebComponents';
import '@/Style';

export const GroupEditPage = (props) => {
        let key_id = props.key_id_outer;
        const EditSkillBox = (props) => {
            // let badge_key = props.keyValue * 20;
            let badge_key = 0;
            return(
                <div key={badge_key++} className="col mr-2 mt-2 group-page-box">
                    <div className="row group-page-box-header">
                        <h1 className="h6 mt-2 ml-3 mb-2">{props.title}</h1>
                    </div>
                    <div>
                        {
                            (props.data || []).map((item) => {
                                return(
                                    <div key={badge_key++}>
                                        <span className="badge badge-pill badge-info mr-2 mt-1 pl-2 pr-2" key={props.item + ' '}>
                                            {item}
                                        </span>
                                    </div>
                                    )
                            })
                        }
                    </div>
                    <span className="badge badge-pill badge-primary mr-1  mt-1 mb-1 profile-tag-container" >
                            <input type="text" 
                            placeholder="add new tag" 
                            className={["group-edit-tag-input"].join(' ')} 
                            />

                    </span>

                </div>
            );
        };

    return(
            <div className="container-fluid pl-4">
                <div className="row mt-2 d-flex justify-content-between flex-wrap">
                    <input className="form-control form-control-lg title-setting" type="text" defaultValue={props.data.title}/>
                </div>
                <div className="row mt-4 border-bottom border-grey">
                    <div className="col-9">
                        <div className="row">
                            <p>Leader: </p>
                            <p>{props.data.leader.username}</p>
                        </div>
                        <div className="row">
                            <p>Member: </p>
                            <p>somebody</p>
                        </div>
                    </div>
                    <div className="col-3 group-page-member-setting text-left">
                        <div className="row">
                            <p className="d-block text-gray-dark"> Member number:</p>
                            <p className="d-block text-gray-dark">{props.data.cur_people}</p>
                        </div>
                        <div className="row">
                            <p className="d-block text-gray-dark">max: </p>
                            <input className="form-control form-control-lg border-1 max-number-setting" type="text" defaultValue={props.data.max_people}/>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        <h6 className="row h6">About This Group</h6>
                    </div>
                    <textarea className="form-control pl-1" defaultValue={props.data.description}></textarea>
                </div>
                {props.data.course &&
                <div className="row mt-3 border-bottom border-grey">
                    <div className="col-12 row">
                        <p>Courses:</p>
                        <input className="ml-1 form-control form-control-lg border-1 course-setting" type="text" defaultValue={props.data.course}/>
                    </div>
                </div>
                }
                <div className="row container pt-3 pl-0">
                    <EditSkillBox keyValue={key_id++} title="Programming languages" data={props.data.technologies }/>
                    <EditSkillBox keyValue={key_id++} title="languages" data={ props.data.languages }/>
                    <EditSkillBox keyValue={key_id++} title="tags" data={ props.data.tags }/>
                </div>
            </div>
    );
};
