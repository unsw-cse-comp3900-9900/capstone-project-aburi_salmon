import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, FormControl, InputLabel, NativeSelect} from '@material-ui/core';
import {Item, Categories, WholeItemList} from './../../../api/models';
import {Client} from './../../../api/client';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open

    isDel: boolean, //if 0 then is remove, else is delete (permanent)
    item: Item | null,
    cat: Categories | null,


}

class Delete extends React.Component<IProps, {allItems: WholeItemList | null, currItem: number}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            allItems: null,
            currItem: 0,
        }
    }

    selectText(){
        if (this.props.isDel){
            return(
                "Are you sure you want to delete the item " +  this.props.item?.name +" from the menu?"
                          +  " There will be no reversing this process."
            );
        } else {
            return (
                "Are you sure you want to remove the item " + this.props.item?.name + " from "
                + this.props.cat?.name
            );
        }
    }

    async componentDidMount(){
        const client = new Client();
        const i: WholeItemList | null = await client.getAllItems();
        if (i !== null) {
            this.setState({ allItems: i });
        }
        console.log(i);
    }

    handleClick(){
        const client = new Client();
        if (this.props.isDel){
            client.deleteItem(this.state.currItem)
                .then((msg) => {
                    //alert(msg.status);
                    if (msg.status === 200) {
                        alert('Success1');
                        this.props.setIsOpen(false);
                    } else {
                        alert(msg.statusText);
                    }
                }).catch((status) => {
                    console.log(status);
                });
        } else {
            console.log(this.props.item?.id);
            console.log(this.props.cat?.id);
            client.removeItemFromCat(this.props.item?.id, this.props.cat?.id)
                .then((msg) => {
                    //alert(msg.status);
                    if (msg.status === 200) {
                        alert('Success2');
                        this.props.setIsOpen(false);
                    } else {
                        alert(msg.statusText);
                    }
                }).catch((status) => {
                    console.log(status);
                });
        }
        
    }

    render() {
        if (!this.props.isDel){
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
        )} else {
            return(
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
                        <FormControl style={{ minWidth: 150, margin: '10px' }}>
                            <InputLabel htmlFor="uncontrolled-native">Item</InputLabel>
                            <NativeSelect
                                defaultValue={1}
                                onChange={(e) => this.setState({ currItem: parseInt(e.target.value) })}
                            >
                                {this.state.allItems && this.state.allItems?.items &&
                                    this.state.allItems?.items.map(item =>
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