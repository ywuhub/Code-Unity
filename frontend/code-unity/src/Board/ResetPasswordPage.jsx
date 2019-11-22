import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'formik';
import '@/Style';
import { SkillBox } from '@/WebComponents';
import { userService, authenticationService } from '@/_services';
import { projectService } from '../_services';

class ResetPasswordPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatars: []
        };
    }

    componentDidMount() {

    }



    render() {
        let key_id = 0;

        return (
            <p> Hello world</p>
        );
    }

}

export { ResetPasswordPage };