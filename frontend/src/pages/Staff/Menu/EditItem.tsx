import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, TextField, FormControl, InputLabel, Select, Input} from '@material-ui/core';

export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
    isEdit: boolean, //if 1 then it is edit, if 0 then is create new
    itemname: string,
}

class EditItem extends React.Component<IProps, {}>{

    render() {
        if (this.props.isEdit) {
            return (
                <div>
                    <Dialog
                        open={this.props.isOpen}
                        onClose={() => this.props.setIsOpen(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Edit Item"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Enter Name <should be filled in...>"
                                    fullWidth

                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="des"
                                    label="Description <filled in>"
                                    fullWidth
                                    multiline={true}

                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="price"
                                    label="Price <filled in>"
                                    fullWidth

                                />
                                <FormControl style={{ minWidth: 150, margin: '10px' }}>
                                    <InputLabel htmlFor="demo-dialog-native">Visibility</InputLabel>
                                    <Select
                                        native
                                        onChange={(e) => console.log(e.target.value)}
                                        input={<Input id="demo-dialog-native" />}>
                                        <option aria-label="None" value="" />
                                        <option value={"Show"}>Show</option>
                                        <option value={"Hide"}> Hide</option>

                                    </Select>
                                </FormControl>
                                <FormControl style={{ minWidth: 150, margin: '10px' }}>
                                    <InputLabel htmlFor="demo-dialog-native">Category</InputLabel>
                                    <Select
                                        native
                                        onChange={(e) => console.log(e.target.value)}
                                        input={<Input id="demo-dialog-native" />}>
                                        <option aria-label="None" value="" />
                                        <option value={"Show"}>Cat1</option>
                                        <option value={"Hide"}>Cat2</option>
                                        <option value={"Hide"}>Etc</option>

                                    </Select>
                                </FormControl>  
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <div style={{width: '100%'}}>
                            <Button onClick={() => this.props.setIsOpen(false)} style={{float:'left'}} color="primary">
                                Nevermind
                            </Button>
                            {/*}
                            <Button onClick={() => this.props.relevantFunction()} color="secondary" autoFocus>
                                Delete Item
            </Button>*/}
                            <Button onClick={() => this.props.relevantFunction()} style={{float:'right'}} color="primary" autoFocus>
                                Modify Item
                            </Button>
                            </div>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        } else {
            return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Add Item"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Enter Name"
                                fullWidth
                                
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="des"
                                label="Description"
                                fullWidth
                                multiline = {true}

                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="price"
                                label="Price"
                                fullWidth

                            />
                            <FormControl style={{ minWidth: 150, margin: '10px'}}>
                                <InputLabel htmlFor="demo-dialog-native">Visibility</InputLabel>
                                <Select
                                    native
                                    onChange={(e) => console.log(e.target.value)}
                                    input={<Input id="demo-dialog-native" />}>
                                    <option aria-label="None" value="" />
                                    <option value={"Show"}>Show</option>
                                    <option value={"Hide"}> Hide</option>
                                    
                                </Select>
                            </FormControl>
                            <FormControl style={{ minWidth: 150, margin: '10px' }}>
                                <InputLabel htmlFor="demo-dialog-native">Category</InputLabel>
                                <Select
                                    native
                                    onChange={(e) => console.log(e.target.value)}
                                    input={<Input id="demo-dialog-native" />}>
                                    <option aria-label="None" value="" />
                                    <option value={"Show"}>Cat1</option>
                                    <option value={"Hide"}>Cat2</option>
                                    <option value={"Hide"}>Etc</option>

                                </Select>
                            </FormControl>  

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <div style={{width:'100%'}}>
                        <Button onClick={() => this.props.setIsOpen(false)} style={{float: 'left'}} color="primary">
                            Nevermind
                            </Button>
                        <Button onClick={() => this.props.relevantFunction()} style={{float:'right'}} color="primary" autoFocus>
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