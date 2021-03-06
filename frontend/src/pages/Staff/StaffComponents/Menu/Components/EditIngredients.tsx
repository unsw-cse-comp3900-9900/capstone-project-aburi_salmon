import React from 'react';
import { Button, Dialog, DialogContent, Radio, DialogActions,TextField, DialogTitle, FormControl, FormControlLabel, RadioGroup} from '@material-ui/core';
import { Ingredient, ResponseMessage} from './../../../../../api/models';
import {Client} from './../../../../../api/client';

//renders edit ingredients dialog (for adding and deleting)
//error checking done

export interface IProps{
    isOpen: boolean, //if dialog is open
    setIsOpen: any, //function to change state of is open
    ingredientsList: Array<Ingredient> | null, //array of all ingredients
    update: any, //force update
    alert: any,
}

interface IState{
    isOpen: boolean, //state of dialog for entering new ingredient name
    newIngred: string, //new ingredient name
    selected: Ingredient | null, //selected ingredient (for delete)
}

class EditIngredients extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            isOpen: false,
            newIngred: '',
            selected: null,
        }
    }

    addIngred(){ //create new ingredient dialog
        return(
        <Dialog
            open={this.state.isOpen}
            onClose={() => this.setState({ isOpen: false })}
            onEnter={() => this.setState({ newIngred: '' })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
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
                    <Button onClick={() => this.handleAddIngred()} style={{ float: 'right' }} color="primary" autoFocus>
                        Add Ingredient
                    </Button>
                </div>
            </DialogActions>
        </Dialog>);

    }  

    async handleAddIngred(){ //adds ingredient to ingredients list
        const client = new Client();
        if (this.state.newIngred !== ''){
            const r: ResponseMessage | null = await client.addIngredient(this.state.newIngred);
            if (r === null) {
                this.props.alert(true, 'error', "Something went wrong");
            } else if (r?.status === "success") {
                this.props.alert(true, 'success', 'Successfully added ingredient');
                this.setState({ isOpen: false });
                this.props.update();
            } else {
                this.props.alert(true, 'error', r.status);
            }
        } else {
            this.props.alert(true, 'error', 'Please enter ingredient name');
        }
        this.setState({ selected: null });
    }

    async handleDeleteIngred(){ //deletes ingredient from ingredient list
        const client = new Client();
        if (this.state.selected !== null){
            const r: any = await client.deleteIngredient(this.state.selected?.id);
            if (r === null) {
                this.props.alert(true, 'error', "Something went wrong");
            } else if (r?.status === "success") {
                this.props.alert(true, 'success', 'Successfully deleted ingredient');
                this.props.update();
            } else {
                this.props.alert(true, 'error', r.message);
            }
        } else {
            this.props.alert(true, 'error', 'Please select an ingredient');
        }
        this.setState({selected: null});
    }

    render(){
        return (
            <Dialog
                open={this.props.isOpen}
                onClose={() => this.props.setIsOpen(false)}
                onEnter={() =>  this.setState({selected: null})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                {this.addIngred()}
                <DialogTitle id="alert-dialog-title">{"Edit Ingredients"}</DialogTitle>
                <DialogContent>

                <FormControl component="fieldset" >
                        <RadioGroup row aria-label="position" name="position" value={this.state.selected?.name === undefined ? '' : this.state.selected?.name }>
                    {
                        this.props.ingredientsList && 
                            this.props.ingredientsList.map(ingredient => 
                                <FormControlLabel
                                control={<Radio color="primary" value={ingredient.name} onChange={() => this.setState({selected: ingredient})}/>}
                                label={ingredient.name}
                                key={ingredient.id}
                                />
                        )   
                    }
                    </RadioGroup>
                </FormControl>
            
                </DialogContent>
                <DialogActions>
                    <div style={{width:'100%'}}>
                    <Button onClick={() => this.props.setIsOpen(false)} color="primary" style={{float: 'left'}}>
                        Cancel
                    </Button>
                    <Button onClick={() => this.handleDeleteIngred()} style={{ float: 'right' }} color="secondary" autoFocus>
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