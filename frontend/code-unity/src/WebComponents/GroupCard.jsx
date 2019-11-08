import React from 'react';

import UserIcon from '@/Assert/catSelfie.png';
import '@/Style';

export const GroupCard = (props) => {
    return(
        <div className="group-card-box">
            <div className="my-3 p-3  bg-white rounded shadow-sm" key={props.keyValue}>
                <div className="row mr-1">
                    <strong className="d-block text-gray-dark ml-4">{props.title}</strong>
                </div>
                <div className="row group-card-member-text mt-1 mb-1">
                    <span className="ml-4"> </span>
                    <p className="d-block text-gray-dark">{props.current_number}</p>
                    <p className="d-block text-gray-dark  ml-2"> Members</p>
                    <p className="d-block text-gray-dark ml-5">max: </p>
                    <p className="d-block text-gray-dark ml-2">{props.max_number}</p>
                    {/*<img src={peopleIcon} className="icon-setting"/>*/}
                </div>
                <div className="row group-card-row-text avatar-div-setting">
                    <span className="ml-4"> </span>
                    <img src={UserIcon} className="avatar rounded-circle"/>
                    <img src={UserIcon} className="avatar rounded-circle"/>
                    <img src={UserIcon} className="avatar rounded-circle"/>
                </div>
                <div className="row group-card-row-text ">
                    <p className="d-block text-gray-dark ml-4 mt-2">{props.description}</p>
                    {/*<img src={peopleIcon} className="icon-setting"/>*/}
                </div>
            </div>
        </div>
    );
};