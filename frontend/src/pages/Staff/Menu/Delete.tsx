import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle} from '@material-ui/core';

export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
    isCat: boolean, //if 1 then it is category, if 0 then is item
    itemname: string,
}

class Delete extends React.Component<IProps, {}>{

    selectText(){
        if (!this.props.isCat){
            return(
                "Are you sure you want to delete the item " +  this.props.itemname +" from the menu?"
                          +  " There will be no reversing this process."
            );
        } else {
            return (
                "Are you sure you want to delete the category " + this.props.itemname + " from the menu?"
                + " There will be no reversing this process."
            );
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.selectText()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary">
                            Nevermind
                        </Button>
                        <Button onClick={() => this.props.relevantFunction()} color="primary" autoFocus>
                            Yes, I'm sure
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Delete;