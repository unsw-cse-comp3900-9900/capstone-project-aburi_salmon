import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle} from '@material-ui/core';
import {Item, Categories} from './../../../api/models';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
    isCat: boolean, //if 1 then it is category, if 0 then is item
    item: Item | null,
    cat: Categories | null,

}

class Delete extends React.Component<IProps, {}>{

    selectText(){
        if (!this.props.isCat){
            return(
                "Are you sure you want to delete the item " +  this.props.item?.name +" from the menu?"
                          +  " There will be no reversing this process."
            );
        } else {
            return (
                "Are you sure you want to delete the category " + this.props.cat?.name + " from the menu?"
                + " There will be no reversing this process."
            );
        }
    }

    handleClick(){
        if (!this.props.isCat){
            this.props.relevantFunction(false);
        } else {
            this.props.relevantFunction(true);
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
                        <Button onClick={() => this.handleClick()} color="primary" autoFocus>
                            Yes, I'm sure
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Delete;