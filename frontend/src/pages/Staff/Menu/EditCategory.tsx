import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions,TextField, DialogTitle} from '@material-ui/core';

export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
    isEdit: boolean, //if 1 then it is edit, if 0 then is create new
    name: string,
}

class EditCategory extends React.Component<IProps, {catName: string}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            catName: '',
        }
    }

    render(){
        if (this.props.isEdit){
            return (
                <div>
                    <Dialog
                        open={this.props.isOpen}
                        onClose={() => this.props.setIsOpen(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedaaddby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Edit Category"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="catName"
                                    label="New Category Name"
                                    fullWidth
                                    onChange={(e) => this.setState({ catName: e.target.value })}
                                />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <div style={{width:'100%'}}>
                            <Button onClick={() => this.props.setIsOpen(false)} color="primary" style={{float: 'left'}}>
                                Nevermind
                            </Button>
                            <Button color="secondary" autoFocus>
                                Delete Category
                            </Button>
                            <Button onClick={() => this.props.relevantFunction()} style={{float:'right'}} color="primary" autoFocus>
                                Modify Category
                            </Button>
                            </div>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        } else {
            return(
                <div>
                    <Dialog
                        open={this.props.isOpen}
                        onClose={() => this.props.setIsOpen(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Add Category"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="catName"
                                    label="Enter Category Name"
                                    fullWidth
                                    onChange = {(e) => this.setState({catName: e.target.value})}
                                />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {this.props.setIsOpen(false); this.setState({catName: ''})}} color="primary">
                                Nevermind
                                </Button>
                            <Button onClick={() => this.props.relevantFunction(this.state.catName)} color="primary" autoFocus>
                                Create Category
                                </Button>
                                
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
    }
}

export default EditCategory;