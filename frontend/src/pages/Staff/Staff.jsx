import React from 'react';
import {withStyles } from '@material-ui/core';
import { styles } from './styles';
import {Restricted} from './Restricted';
import {StaffMain} from './StaffMain';

class StaffPage extends React.Component {

    isStaff(){
        if (localStorage.getItem('staff') === 'true'){
            return(<StaffMain />);
        } else {
            return(<Restricted />);
        }
    }

    render() {
        return (
            <div>
                {this.isStaff()}
                <h1>Staff is {localStorage.getItem('username') || 'failed'}</h1>
            </div>
        );
    }
}


export const Staff = withStyles(styles)(StaffPage);
