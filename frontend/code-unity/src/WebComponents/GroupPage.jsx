import React from 'react';
import { SkillBox } from '@/WebComponents';
import '@/Style';

export const GroupPage = (props) => {
        let key_id = props.key_id_outer;
    return(
            <div class="container-fluid pl-4">
                <div class="row mt-2 d-flex justify-content-between flex-wrap">
                    <h4 class="h1">{props.data.title}</h4>
                </div>
                <div class="row mt-4 border-bottom border-grey">
                    <div class="col-9">
                        <div class="row">
                            <p>Leader: </p>
                            <p>{props.data.leader}</p>
                        </div>
                        <div class="row">
                            <p>Member: </p>
                            <p>somebody</p>
                        </div>
                    </div>
                    <div class="col-3 group-page-member-setting text-left">
                        <div class="row">
                            <p class="d-block text-gray-dark"> Member number:</p>
                            <p class="d-block text-gray-dark">{props.data.cur_people}</p>
                        </div>
                        <div class="row">
                            <p class="d-block text-gray-dark">max: </p>
                            <p class="d-block text-gray-dark">{props.data.max_people}</p>
                        </div>
                    </div>
                </div>

                <div class="row mt-4 border-bottom border-grey">
                    <div class="col-12">
                        <h6 class="row h6">About This Group</h6>
                        <p class="row pt-2">{props.data.description}</p>
                    </div>
                </div>
                {props.data.course &&
                <div class="row mt-3 border-bottom border-grey">
                    <div class="col-12 row">
                        <p>Courses:</p>
                        <p>{props.data.course}</p>
                    </div>
                </div>
                }
                <div class="row container pt-3 pl-0">
                    <SkillBox keyValue={key_id++} title="Programming languages" data={props.data.technologies }/>
                    <SkillBox keyValue={key_id++} title="languages" data={ props.data.languages }/>
                    <SkillBox keyValue={key_id++} title="tags" data={ props.data.tags }/>
                </div>
            </div>
    );
};
