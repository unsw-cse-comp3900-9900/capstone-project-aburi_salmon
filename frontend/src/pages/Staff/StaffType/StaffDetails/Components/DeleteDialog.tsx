import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle} from '@material-ui/core';

export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    deleteStaff: any,
}

class DeleteDialog extends React.Component<IProps, {}>{

    render(){
        return (
            <div>
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are You Sure?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this staff? There will be no reversing this process.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary">
                            Nevermind
                        </Button>
                        <Button onClick={() => this.props.deleteStaff()} color="primary" autoFocus>
                            Yes, I'm sure
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default DeleteDialog;