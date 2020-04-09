import React from 'react';
import { Button, Dialog, DialogContent, DialogActions,TextField, DialogTitle, FormControl, InputLabel, NativeSelect} from '@material-ui/core';
import {Categories, Menu, ResponseMessage} from './../../../../../api/models';
import {Client} from './../../../../../api/client';

//renders edit category and add category dialog

export interface IProps{
    isOpen: boolean, //if dialog is open
    setIsOpen: any, //function to change state of isOpen
    isEdit: boolean, //if 1 then it is edit, if 0 then is create new
    category: Categories | null, //current category
    wholemenu: Menu | null, //whole menu
    update: any, //force update
    alert: any,
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

    async addEditCat(categoryName: string, isAdd: boolean) { //add or edit category
        console.log(categoryName);
        if (isAdd) { //add category
            const client = new Client();
            const r: ResponseMessage | null = await client.addCategory(categoryName);
            console.log(r);
            if (r === null) {
                this.props.alert(true, 'error', "Something went wrong");
            } else if (r?.status === "success") {
                this.props.alert(true, 'success', 'Successfully added category.');
                this.props.setIsOpen(false);
                this.props.update();
            } else {
                this.props.alert(true, 'error', r.status);
            }
        } else { //edit category
            const client = new Client();
            const r: ResponseMessage | null = await client.editCategory(categoryName, this.props.category?.position, this.props.category?.id);
            console.log(r);
            if (r === null) {
                this.props.alert(true, 'error', "Something went wrong");
            } else if (r?.status === "success") {
                this.props.alert(true, 'success', 'Category successfully modified.');
                this.props.setIsOpen(false);
                this.props.update();
            } else {
                this.props.alert(true, 'error', r.status);
            }
        }
    }

    async deleteFun(){ //delete category
        const client = new Client();
        const r: ResponseMessage | null = await client.deleteCat(this.props.category?.id);
        console.log(r);
        if (r === null) {
            this.props.alert(true, 'error', "Something went wrong");
        } else if (r?.status === "success") {
            this.props.alert(true, 'success', 'Successfully deleted category');
            this.props.setIsOpen(false);
            this.props.update();
        } else {
            this.props.alert(true, 'error', r.status);
        }
    }

    async handleClick(){ //for switching category positions
        //if name is different, send to server
        if (this.state.catName !== this.props.category?.name && this.state.catName !== ''){
            this.addEditCat(this.state.catName, false);
        } //if wants to switch position
        if (this.state.currCat !== -1){
            const client = new Client();
            const r: ResponseMessage | null= await client.catSwitch(this.state.currCat, this.props.category?.id)
            console.log(r);
            if (r === null) {
                this.props.alert(true, 'error', "Something went wrong");
            } else if (r?.status === "success") {
                this.props.alert(true, 'success', 'Successfully switched category positions');
                this.props.setIsOpen(false);
                this.props.update();
            } else {
                this.props.alert(true, 'error', r.status);
            }
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