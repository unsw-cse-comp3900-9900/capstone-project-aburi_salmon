import React from 'react';
import { TextField, Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export interface IProps {
    isOpen: boolean,
    severity: "success"| "info"|"error" | "warning",
    alertMessage: string,
    changeState: any,
}

class AlertSnackbar extends React.Component<IProps, {}> {
    render(){
        return(
            <Snackbar
                open={this.props.isOpen}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={this.props.severity}
                    action={
                        <Button color="inherit" size="small" onClick={() => this.props.changeState(false)}>
                            OK
                        </Button>
                    }
                >{this.props.alertMessage}</Alert>
            </Snackbar>
        );
    }
}

export default AlertSnackbar;