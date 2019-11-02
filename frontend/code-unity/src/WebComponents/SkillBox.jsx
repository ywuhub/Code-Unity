import React from 'react';
import '@/Style';

export const SkillBox = (props) => (
    <div class="col mr-2 mt-2 group-page-box">
        <div class="row group-page-box-header">
            <h1 class="h6 mt-2 ml-3 mb-2">{props.title}</h1>
        </div>
        <div>
            {
                (props.data || []).map((item) => {
                    return(
                        <span className="badge badge-pill badge-info mr-2 mt-1 pl-2 pr-2" key={props.item + ' '}>
                            {item}
                        </span>
                        )
                })
            }
        </div>
    </div>
);
