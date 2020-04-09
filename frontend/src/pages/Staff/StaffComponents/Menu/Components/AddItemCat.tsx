import React from 'react';
import { Button, Dialog, DialogContent,  DialogActions, DialogTitle, FormControl, InputLabel, NativeSelect} from '@material-ui/core';
import {Menu, WholeItemList, ResponseMessage} from './../../../../../api/models';
import {Client} from './../../../../../api/client';

//Class that renders dialog for adding an item to a category

//What needs to be passed in
export interface IProps{
    isOpen: boolean, //whether dialog is open
    setIsOpen: any, //function that controls whether to open dialog
    wholemenu: Menu | null, //whole menu
    allItems: WholeItemList | null, //all existing items
    update: any, //force update function
    alert: any, //create an alert
}

//States it keeps track of
interface IState{
    currItem: number, //selected item
    currCat: number, //selected category
}

class AddItemCat extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            currItem: 0,
            currCat: 0,
        }
    }

    //sends info to server
    async handleClick(){
        const client = new Client();
        const r: ResponseMessage | null= await client.addItemToCat(0,this.state.currCat, this.state.currItem);
        console.log(r);
        if (r === null) {
            this.props.alert(true, 'error', "Something went wrong");
        } else if (r?.status === "success") {
            this.props.alert(true, 'success', 'Successful');
            this.props.setIsOpen(false);
            this.props.update();
        } else {
            this.props.alert(true, 'error', r.status);
        }
        /*
            if (msg.status === 200) {
                this.props.alert(true,'success', 'Successful');
                this.props.setIsOpen(false);
                this.props.update();
            } else {
                this.props.alert(true, 'error', msg.statusText);
            }*/
        
    }

    render() {
        return (
            <Dialog
                open={this.props.isOpen}
                onClose={() => this.props.setIsOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Add Item to Category"}</DialogTitle>
                <DialogContent>
                        <FormControl style={{ minWidth: 150, margin: '10px' }}>
                        <InputLabel htmlFor="uncontrolled-native">Item</InputLabel>
                        <NativeSelect
                            defaultValue={this.props.allItems?.items[0].id}
                            onChange={(e) => this.setState({currItem:parseInt(e.target.value) })}
                        >
                            {this.props.allItems && this.props.allItems?.items &&
                                this.props.allItems?.items.map(item =>
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                )
                            }
                        </NativeSelect>
                    </FormControl>
                    <FormControl style={{ minWidth: 150, margin: '10px' }}>
                        <InputLabel htmlFor="uncontrolled-native">Category</InputLabel>
                        <NativeSelect
                            defaultValue={this.props.wholemenu?.menu[0].id}
                            onChange={(e) => this.setState({ currCat:parseInt(e.target.value) })}
                        >
                            {this.props.wholemenu && this.props.wholemenu?.menu &&
                                this.props.wholemenu?.menu.map(category =>
                                    <option value={category.id} key={category.id}>{category.name}</option>
                                )
                            }
                        </NativeSelect>
                    </FormControl>  
                </DialogContent>
                <DialogActions>
                    <div style={{width: '100%'}}>
                        <Button onClick={() => this.props.setIsOpen(false) } style={{float:'left'}} color="primary">
                            Cancel
                        </Button>
                        <Button style={{float:'right'}} color="primary" autoFocus onClick={() => this.handleClick()}> 
                            Add
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>  
        );
    }
}

export default AddItemCat;