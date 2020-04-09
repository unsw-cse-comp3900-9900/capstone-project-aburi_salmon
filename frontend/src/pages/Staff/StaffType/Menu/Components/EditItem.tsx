import React from 'react';
import { Button, Dialog, DialogContent,  DialogActions, DialogTitle, TextField} from '@material-ui/core';
import {Item, Menu} from './../../../../../api/models';
import {Client} from './../../../../../api/client';

//renders the edit or create item dialog

export interface IProps{
    isOpen: boolean, //state of dialog
    setIsOpen: any, //function to change state of isOpen
    isEdit: boolean, //if 1 then it is edit, if 0 then is create new
    item: Item, //current item
    wholemenu: Menu | null, //whole menu
    updatemenu: any, //force update menu
    updateitems: any,  //force update items
    alert: any,
}

interface IState{
    name: string, //name of new item
    description: string, //description of new item
    price: number, //price of new item
}

class EditItem extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            name: '',
            description:'',
            price: 0,
        }
        this.submitEdit = this.submitEdit.bind(this);
    }

    submitCreate(){ //create new item
        this.addEditItem(this.state.name, this.state.description, this.state.price);
        this.componentDidMount();
    }

    submitEdit(){ //edit existing item
        //had some problems with setState   
        if (this.state.name === ''){
            var tempname = this.props.item?.name;
        } else {
            var tempname = this.state.name;
        }
        if (this.state.description === ''){
            var tempdes = this.props.item?.description;
        } else {
            var tempdes = this.state.description;
        }
        if (this.state.price === 0 ){
            var tempprice = this.props.item?.price;
        }else {
            var tempprice = this.state.price;
        }
        this.addEditItem(tempname, tempdes, tempprice);
        this.componentDidMount();
    }

    async componentDidMount(){ //reset values
        this.setState({ name: '', description: '', price: 0});
    }

    addEditItem(name: string, description: string, price: number) { //fetchs from server
        const client = new Client();
        if (this.props.isEdit) { //if editing existing item
            client.editItem(name, description, price, true ,this.props.item.id)
            .then((msg) => {
                if (msg.status === 200) {
                    this.props.alert(true, 'success', 'Successfully edited item');
                    this.props.setIsOpen(false);
                    this.props.updatemenu();
                } else {
                    this.props.alert(true, 'error', msg.statusText);
                }
            }).catch((status) => {
                console.log(status);
            });
        } else { //if adding item
            client.addItem(name, description, price, true)
            .then((msg) => {
                if (msg.status === 200) {
                    this.props.alert(true, 'success', 'Successfully added item');
                    this.props.setIsOpen(false);
                    this.props.updateitems();
                } else {
                    this.props.alert(true, 'error', msg.statusText);
                }
            }).catch((status) => {
                console.log(status);
            });
        }
    }

    render() {
        if (this.props.isEdit) { //if is editing item, the current fields will be filled in
            return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Edit Item"}</DialogTitle>
                    <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Enter Name"
                                fullWidth
                                onChange={(e) => this.setState({ name: e.target.value })}
                                defaultValue={this.props.item?.name}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="des"
                                label="Description <filled in>"
                                fullWidth
                                multiline={true}
                                onChange={(e) => this.setState({ description: e.target.value })}
                                defaultValue={this.props.item?.description}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="price"
                                label="Price <filled in>"
                                fullWidth
                                defaultValue={this.props.item?.price}
                                onChange={(e) => this.setState({ price: parseInt(e.target.value) })}
                            />
                    </DialogContent>
                    <DialogActions>
                        <div style={{width: '100%'}}>
                            <Button onClick={() => this.props.setIsOpen(false) } style={{float:'left'}} color="primary">
                            Nevermind
                        </Button>
                        <Button onClick={() => this.submitEdit()} style={{float:'right'}} color="primary" autoFocus>
                            Modify Item
                        </Button>
                        </div>
                    </DialogActions>
                </Dialog>
                
            );
        } else { //adding new item
            return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Create Item"}</DialogTitle>
                    <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Enter Name"
                                fullWidth
                            onChange={(e) => this.setState({ name: e.target.value })}
                                
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="des"
                                label="Description"
                                fullWidth
                                multiline = {true}
                            onChange={(e) => this.setState({ description: e.target.value })}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="price"
                                label="Price"
                                fullWidth
                            onChange={(e) => this.setState({ price: parseInt(e.target.value) })}
                            />
                    </DialogContent>
                    <DialogActions>
                        <div style={{width:'100%'}}>
                        <Button onClick={() => this.props.setIsOpen(false)} style={{float: 'left'}} color="primary">
                            Cancel
                            </Button>
                        <Button onClick={() => this.submitCreate()} style={{float:'right'}} color="primary" autoFocus>
                            Create Item
                            </Button>
                          </div>  
                    </DialogActions>
                </Dialog>
            );
        }
    }
}

export default EditItem;