import React from 'react';
import { Button, Dialog, DialogContent,  DialogActions, DialogTitle, TextField} from '@material-ui/core';
import {Item, Menu, ResponseMessage} from './../../../../../api/models';
import {Client} from './../../../../../api/client';

//renders the edit or create item dialog
//error checking added

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
    image_url: string,
}

class EditItem extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            name: '',
            description:'',
            price: 0,
            image_url: '',
        }
        this.submitEdit = this.submitEdit.bind(this);
    }

    submitCreate(){ //create new item
        if (this.state.name === ''){
            this.props.alert(true, 'error', 'Item name required');
        } else if (this.state.description === ''){
            this.props.alert(true, 'error', 'Item description required');
        } else if (isNaN(this.state.price)){
            this.props.alert(true, 'error', 'Price needs to be a number');
        } else {
            this.addEditItem(this.state.name, this.state.description, this.state.price, this.state.image_url);
        } 
    }

    submitEdit(){ //edit existing item
        if (this.state.name === '') {
            this.props.alert(true, 'error', 'Item name required');
        } else if (this.state.description === '') {
            this.props.alert(true, 'error', 'Item description required');
        } else if (isNaN(this.state.price)) {
            this.props.alert(true, 'error', 'Price needs to be a number');
        } else if (this.state.name === this.props.item?.name && this.state.description === this.props.item?.description &&
           this.state.price === this.props.item?.price && this.state.image_url === this.props.item?.image_url){
               this.props.alert(true, 'error', 'No change in item detected');
        } else {
            this.addEditItem(this.state.name, this.state.description, this.state.price, this.state.image_url);
        }
        
    }

    initAdd(){
        this.setState({ name: '', description: '', price: 0, image_url: ''});
    }

    initEdit(){
        if (this.props.item !== null){
            this.setState({ name: this.props.item?.name, description: this.props.item?.description});
            this.setState({price: this.props.item?.price, image_url: this.props.item?.image_url });
        }
    }
    
    async addEditItem(name: string, description: string, price: number, image_url: string) { //fetchs from server
        const client = new Client();
        if (this.props.isEdit) { //if editing existing item
            const r: ResponseMessage | null = await client.editItem(name, description, price, true ,this.props.item.id, image_url);
            if (r === null) {
                this.props.alert(true, 'error', "Something went wrong");
            } else {//if (r?.status === "success") {
                this.props.alert(true, 'success', 'Successfully edited item');
                this.props.setIsOpen(false);
                this.props.updatemenu();
            }/* else {
                this.props.alert(true, 'error', r.status);
            }*/
        } else { //if adding item
            const r: ResponseMessage | null = await client.addItem(name, description, price, true, image_url);
            if (r === null) {
                this.props.alert(true, 'error', "Something went wrong");
            } else {//if (r?.status === "success") {
                this.props.alert(true, 'success', 'Successfully added item');
                this.props.setIsOpen(false);
                this.props.updateitems();
            } /*else {
                this.props.alert(true, 'error', r.status);
            }*/
        }
    }

    render() {
        if (this.props.isEdit) { //if is editing item, the current fields will be filled in
            return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    onEnter={() => this.initEdit()}
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
                            <TextField
                                autoFocus
                                margin="dense"
                                id="imageurl"
                                label="Image URL (can be blank)"
                                fullWidth
                                defaultValue={this.props.item?.image_url}
                                onChange={(e) => this.setState({ image_url: e.target.value })}
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
                    onEnter={() => this.initAdd()}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Create Item"}</DialogTitle>
                    <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Enter Name*"
                                fullWidth
                            onChange={(e) => this.setState({ name: e.target.value })}
                                
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="des"
                                label="Description*"
                                fullWidth
                                multiline = {true}
                            onChange={(e) => this.setState({ description: e.target.value })}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="price"
                                label="Price*"
                                fullWidth
                            onChange={(e) => this.setState({ price: parseInt(e.target.value) })}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="imageurl"
                                label="Image URL (blank for no image)"
                                fullWidth
                            onChange={(e) => this.setState({ image_url: e.target.value })}
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