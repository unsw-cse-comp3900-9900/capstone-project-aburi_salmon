import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, FormControl, InputLabel, NativeSelect} from '@material-ui/core';
import {Item, Categories, WholeItemList, ResponseMessage} from './../../../../../api/models';
import {Client} from './../../../../../api/client';

//Used to render the delete dialog to delete items from category or permanently
//No error checking either

export interface IProps{
    isOpen: boolean, //state of dialog
    setIsOpen: any, //function to change state of is open
    isDel: boolean, //if 0 then is remove, else is delete (permanent)
    item: Item | null, //current item
    cat: Categories | null, //current category
    allItems: WholeItemList | null, //whole menu
    updatemenu: any, //a function to force update
    updateitems: any,
    alert: any //function for alert
}

class Delete extends React.Component<IProps, {currItem: number}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            currItem: 0, //current item (for selecting permanent delete)
        }
    }

    selectText(){
        if (this.props.isDel){
            return(
                      "Note: There will be no reversing this process."
            );
        } else {
            return (
                "Are you sure you want to remove the item " + this.props.item?.name + " from "
                + this.props.cat?.name
            );
        }
    }

    async handleClick(){
        const client = new Client();
        if (this.props.isDel){  //permanent delete
            const r: ResponseMessage | null= await client.deleteItem(this.state.currItem);
            console.log(r);
            if (r === null) {
                this.props.alert(true, 'error', "Something went wrong");
            } else if (r?.status === "success") {
                this.props.alert(true, 'success', 'Successfully deleted item');
                this.props.setIsOpen(false);
                this.props.updatemenu();
                this.props.updateitems();
            } else {
                this.props.alert(true, 'error', r.status);
            }
        } else { // delete item from category
            console.log(this.props.item?.id);
            console.log(this.props.cat?.id);
            var itemname = this.props.item?.name;
            var catname = this.props.cat?.name;
            const r: ResponseMessage | null = await client.removeItemFromCat(this.props.item?.id, this.props.cat?.id);
            console.log(r);
            if (r === null) {
                this.props.alert(true, 'error', "Something went wrong");
            } else if (r?.status === "success") {
                this.props.alert(true, 'success', 'Successfully removed ' + itemname + ' from ' + catname);
                this.props.setIsOpen(false);
                this.props.updatemenu();
            } else {
                this.props.alert(true, 'error', r.status);
            }
        } 
    }

    render() {
        if (!this.props.isDel){ //delete from category
            return (
                <div>
                    <Dialog
                        open={this.props.isOpen}
                        onClose={() => this.props.setIsOpen(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
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
            )
        } else { //delete permanently
            return(
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.selectText()}
                        </DialogContentText>
                        <FormControl style={{ minWidth: 150, margin: '10px' }}>
                            <InputLabel htmlFor="uncontrolled-native">Item</InputLabel>
                            <NativeSelect
                                defaultValue={1}
                                onChange={(e) => this.setState({ currItem: parseInt(e.target.value) })}
                            >
                                {this.props.allItems && this.props.allItems?.items &&
                                    this.props.allItems?.items.map(item =>
                                        <option value={item.id} key={item.id}>{item.name}</option>
                                    )
                                }
                            </NativeSelect>
                        </FormControl>
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
            )
        }
    }
}

export default Delete;