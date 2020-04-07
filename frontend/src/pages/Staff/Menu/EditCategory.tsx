import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions,TextField, DialogTitle} from '@material-ui/core';
import {Categories} from './../../../api/models';
import {Client} from './../../../api/client';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
    isEdit: boolean, //if 1 then it is edit, if 0 then is create new
    category: Categories | null,
    catNo: number | undefined,
}

class EditCategory extends React.Component<IProps, {catName: string}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            catName: '',
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
                                    label="New Category Name"
                                    fullWidth
                                    defaultValue={this.props.category?.name}
                                    onChange={(e) => this.setState({ catName: e.target.value })}
                                />
                 
                        </DialogContent>
                        <DialogActions>
                            <div style={{width:'100%'}}>
                            <Button onClick={() => this.props.setIsOpen(false)} color="primary" style={{float: 'left'}}>
                                Cancel
                            </Button>
                            <Button color="secondary" autoFocus onClick={() => this.deleteFun()}>
                                Delete Category
                            </Button>
                            <Button onClick={() => this.props.relevantFunction(this.state.catName, false)} style={{float:'right'}} color="primary" autoFocus>
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