import React from 'react';
import { Button, Dialog, DialogContent, DialogActions,TextField, DialogTitle, FormControl, InputLabel, NativeSelect} from '@material-ui/core';
import {Categories, Menu} from './../../../api/models';
import {Client} from './../../../api/client';

//renders edit category and add category dialog

export interface IProps{
    isOpen: boolean, //if dialog is open
    setIsOpen: any, //function to change state of isOpen
    isEdit: boolean, //if 1 then it is edit, if 0 then is create new
    category: Categories | null, //current category
    wholemenu: Menu | null, //whole menu
    update: any, //force update
}

interface IState{
    catName: string, //new category name
    currCat: number //id of category to switch position with
}

class EditCategory extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            catName: '',
            currCat: -1, //no switch
        }
    }

    addEditCat(categoryName: string, isAdd: boolean) { //add or edit category
        console.log(categoryName);
        if (isAdd) { //add category
            const client = new Client();
            client.addCategory(categoryName)
                .then((msg) => {
                    if (msg.status === 200) {
                        alert('Success');
                        this.props.setIsOpen(false);
                        this.props.update();
                    } else {
                        alert(msg.statusText);
                    }
                }).catch((status) => {
                    console.log(status);
                });
        } else { //edit category
            const client = new Client();
            client.editCategory(categoryName, this.props.category?.position, this.props.category?.id)
                .then((msg) => {
                    //alert(msg.status);
                    if (msg.status === 200) {
                        alert('Successfully edited');
                        this.props.setIsOpen(false);
                        this.props.update();
                    } else {
                        alert(msg.statusText);
                    }
                }).catch((status) => {
                    console.log(status);
                });
        }
    }

    deleteFun(){ //delete category
        const client = new Client();
        client.deleteCat(this.props.category?.id)
        .then((msg) => {
            if (msg.status === 200) {
                alert('Success');
                this.props.setIsOpen(false);
                this.props.update();
            } else {
                alert(msg.statusText);
            }
        }).catch((status) => {
            console.log(status);
        });
    }

    handleClick(){ //for switching category positions
        //if name is different, send to server
        if (this.state.catName !== this.props.category?.name && this.state.catName !== ''){
            this.addEditCat(this.state.catName, false);
        } //if wants to switch position
        if (this.state.currCat !== -1){
            const client = new Client();
            client.catSwitch(this.state.currCat, this.props.category?.id)
                .then((msg) => {
                    if (msg.status === 200) {
                        alert('Successfully switched');
                        this.props.setIsOpen(false);
                        this.props.update();
                    } else {
                        alert(msg.statusText);
                    }
                }).catch((status) => {
                    console.log(status);
                });
        }
    }

    printCategories(category: Categories){ //print dropbox values, doesn't print itself
        if (category.id !== this.props.category?.id){
            return(
                <option value={category.id} key={category.id}>{category.name}</option>
            );
        }
    }

    async componentDidMount(){ //reset
        this.setState({ catName: '', currCat: -1 });
    }

    render(){
        if (this.props.isEdit){  //edit dialog content
            return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Edit Category"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="catName"
                            label="Category Name"
                            fullWidth
                            defaultValue={this.props.category?.name}
                            onChange={(e) => this.setState({ catName: e.target.value })}
                        />
                    <FormControl style={{ minWidth: 150, margin: '10px' }}>
                        <InputLabel htmlFor="uncontrolled-native">Switch position with</InputLabel>
                        <NativeSelect
                            defaultValue={-1}
                            onChange={(e) => this.setState({ currCat: parseInt(e.target.value) })}
                        >
                            <option value={-1} key={-1}>None</option>
                            {this.props.wholemenu && this.props.wholemenu?.menu &&
                                this.props.wholemenu?.menu.map(category =>
                                    this.printCategories(category)
                                )
                            }
                        </NativeSelect>
                    </FormControl>  
                
                    </DialogContent>
                    <DialogActions>
                        <div style={{width:'100%'}}>
                            <Button onClick={() => { this.props.setIsOpen(false); this.componentDidMount()}} 
                                color="primary" style={{float: 'left'}}>
                            Cancel
                        </Button>
                        <Button color="secondary" autoFocus onClick={() => this.deleteFun()}>
                            Delete Category
                        </Button>
                        <Button onClick={() => this.handleClick()} style={{float:'right'}} color="primary" autoFocus>
                            Modify Category
                        </Button>
                        </div>
                    </DialogActions>
                </Dialog>
  
            );
        } else { //add dialog content
            return(
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Add Category"}</DialogTitle>
                    <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="catName"
                                label="Enter Category Name"
                                fullWidth
                                onChange = {(e) => this.setState({catName: e.target.value})}
                            />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.props.setIsOpen(false); this.componentDidMount()}} color="primary">
                            Nevermind
                        </Button>
                        <Button onClick={() => this.addEditCat(this.state.catName,true)} color="primary" autoFocus>
                            Create Category
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    }
}

export default EditCategory;