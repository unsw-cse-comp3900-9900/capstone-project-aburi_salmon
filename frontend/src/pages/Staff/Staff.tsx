import React from 'react';
import {withStyles } from '@material-ui/core';
import { styles } from './styles';
import {Restricted} from './Restricted';
import {StaffMain} from './StaffMain';
import history from '../../history';

class StaffPage extends React.Component {

    isStaff(){
        if (localStorage.getItem('staff') === 'true'){
            return(<StaffMain />);
        } else {
            alert('You must log in to enter this page');
            history.push('/');
            return(
                <Restricted />
            );
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
