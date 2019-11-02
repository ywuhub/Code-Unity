import React from 'react';

import UserIcon from '@/Assert/catSelfie.png';
import '@/Style';

export const GroupCard = (props) => (
    <div class="my-3 p-3  bg-white rounded shadow-sm">
        <div className="row mr-1">
            <strong class="d-block text-gray-dark ml-4">{props.title}</strong>
        </div>
        <div className="row group-card-member-text mt-1 mb-1">
            <span className="ml-4"> </span>
            <p class="d-block text-gray-dark">{props.current_number}</p>
            <p class="d-block text-gray-dark  ml-2"> Members</p>
            <p class="d-block text-gray-dark ml-5">max: </p>
            <p class="d-block text-gray-dark ml-2">{props.max_number}</p>
            {/*<img src={peopleIcon} className="icon-setting"/>*/}
        </div>
        <div className="row group-card-row-text avatar-div-setting">
            <span className="ml-4"> </span>
            <img src={UserIcon} className="avatar rounded-circle"/>
            <img src={UserIcon} className="avatar rounded-circle"/>
            <img src={UserIcon} className="avatar rounded-circle"/>
        </div>
        <div className="row group-card-row-text ">
            <p class="d-block text-gray-dark ml-4 mt-2">{props.description}</p>
            {/*<img src={peopleIcon} className="icon-setting"/>*/}
        </div>
    </div>
);