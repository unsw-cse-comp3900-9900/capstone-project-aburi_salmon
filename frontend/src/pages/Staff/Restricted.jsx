import React from 'react';
import { withStyles} from '@material-ui/core';
import { styles } from './styles';
// import './LoginRegister.css';

class PureRestricted extends React.Component {

    render() {
        return (
            <div>
                <h1>Restricted Access</h1>
            </div>
        );
    }
}

export const Restricted = withStyles(styles)(PureRestricted);