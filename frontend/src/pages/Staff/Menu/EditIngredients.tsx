import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions,TextField, DialogTitle, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox} from '@material-ui/core';
import {Categories} from './../../../api/models';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
}

class EditIngredients extends React.Component<IProps, {isOpen: boolean, newIngred: string}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            isOpen: false,
            newIngred: '',
        }
    }

    addIngred(){
        return(
        <Dialog
            open={this.state.isOpen}
                onClose={() => this.setState({ isOpen: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Add Ingredient"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="catName"
                    label="Enter Ingredient"
                    fullWidth
                    onChange={(e) => this.setState({ newIngred: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <div style={{ width: '100%' }}>
                    <Button onClick={() => this.setState({isOpen: false})} color="primary" style={{ float: 'left' }}>
                        Cancel
                        </Button>
                    <Button onClick={() => this.props.relevantFunction()} style={{ float: 'right' }} color="primary" autoFocus>
                        Add Ingredient
                        </Button>
                </div>
            </DialogActions>
        </Dialog>);

    }


    render(){
        return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {this.addIngred()}
                    <DialogTitle id="alert-dialog-title">{"Edit Ingredients"}</DialogTitle>
                    <DialogContent>
                    <FormControl component="fieldset" >
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox color="primary" name="1" />}
                                label="Ingred1"
                            />
                            <FormControlLabel
                                control={<Checkbox color="primary" name="2" />}
                                label="Ingred2"
                            />
                            <FormControlLabel
                                control={<Checkbox color="primary" name="3" />}
                                label="Ingred3"
                            />
                        </FormGroup>
                    </FormControl>
                            
                
                    </DialogContent>
                    <DialogActions>
                        <div style={{width:'100%'}}>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary" style={{float: 'left'}}>
                            Cancel
                        </Button>
                        <Button onClick={() => this.props.relevantFunction()} style={{ float: 'right' }} color="secondary" autoFocus>
                            Delete Selected
                        </Button>

                        <Button onClick={() => this.setState({isOpen:true})} style={{float:'right'}} color="primary" autoFocus>
                            Add Ingredient
                        </Button>
                        </div>
                    </DialogActions>
                </Dialog>

        );

    }
}

export default EditIngredients;