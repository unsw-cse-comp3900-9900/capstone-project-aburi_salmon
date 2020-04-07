import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions,TextField, DialogTitle, FormControl, InputLabel, NativeSelect} from '@material-ui/core';
import {Categories, Menu} from './../../../api/models';
import {Client} from './../../../api/client';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
    isEdit: boolean, //if 1 then it is edit, if 0 then is create new
    category: Categories | null, //current category
    catNo: number | undefined,
    wholemenu: Menu | null,
}

class EditCategory extends React.Component<IProps, {catName: string, currCat: number}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            catName: '',
            currCat: -1,
        }
    }

    deleteFun(){
        const client = new Client();
        //.then.catch stuff for alert
        client.deleteCat(this.props.category?.id)
            .then((msg) => {
                //alert(msg.status);
                if (msg.status === 200) {
                    alert('Success');
                    this.props.setIsOpen(false);
                   
                } else {
                    alert(msg.statusText);
                }
            }).catch((status) => {
                console.log(status);
            });
    }

    printCategories(category: Categories){
        if (category.id !== this.props.category?.id){
            return(
                <option value={category.id} key={category.id}>{category.name}</option>
            );
        }
    }

    handleClick(){
        if (this.state.catName !== this.props.category?.name){
            this.props.relevantFunction(this.state.catName, false);
        }
        if (this.state.currCat !== -1){
            const client = new Client();
            client.catSwitch(this.state.currCat, this.props.category?.id);
        }
    }

    render(){
        if (this.props.isEdit){
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
                                <option value={-1} key={-1}>No change</option>
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
                            <Button onClick={() => this.props.setIsOpen(false)} color="primary" style={{float: 'left'}}>
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
        } else {
            return(
           
                    <Dialog
                        open={this.props.isOpen}
                        onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
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
                            <Button onClick={() => {this.props.setIsOpen(false); this.setState({catName: ''})}} color="primary">
                                Nevermind
                                </Button>
                            <Button onClick={() => this.props.relevantFunction(this.state.catName,true)} color="primary" autoFocus>
                                Create Category
                                </Button>
                                
                        </DialogActions>
                    </Dialog>
    
            );
        }
    }
}

export default EditCategory;