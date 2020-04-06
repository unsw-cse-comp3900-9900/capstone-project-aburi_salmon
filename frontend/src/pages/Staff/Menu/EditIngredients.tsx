import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions,TextField, DialogTitle, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox} from '@material-ui/core';
import {Categories} from './../../../api/models';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
}

class EditIngredients extends React.Component<IProps, {catName: string}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            catName: '',
        }
    }

    render(){
        return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Edit Ingredients"}</DialogTitle>
                    <DialogContent>
                    <FormControl component="fieldset" >
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox color="primary" name="gilad" />}
                                label="Gilad Gray"
                            />
                            <FormControlLabel
                                control={<Checkbox color="primary" name="jason" />}
                                label="Jason Killian"
                            />
                            <FormControlLabel
                                control={<Checkbox color="primary" name="antoine" />}
                                label="Antoine Llorca"
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

                        <Button onClick={() => this.props.relevantFunction()} style={{float:'right'}} color="primary" autoFocus>
                            Add Ingredient
                        </Button>
                        </div>
                    </DialogActions>
                </Dialog>

        );

    }
}

export default EditIngredients;