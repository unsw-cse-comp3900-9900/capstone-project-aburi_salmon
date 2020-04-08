import React from 'react';
import { Button, Dialog, DialogContent, Radio, DialogActions,TextField, DialogTitle, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, RadioGroup} from '@material-ui/core';
import {Categories, Ingredient} from './../../../api/models';
import {Client} from './../../../api/client';

//renders edit ingredients dialog (for adding and deleting)

export interface IProps{
    isOpen: boolean, //if dialog is open
    setIsOpen: any, //function to change state of is open
    ingredientsList: Array<Ingredient> | null, //array of all ingredients
    update: any, //force update
}

interface IState{
    isOpen: boolean, //state of dialog for entering new ingredient name
    newIngred: string, //new ingredient name
    selected: Ingredient, //selected ingredient (for delete)
}

class EditIngredients extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        const temp: Ingredient = { //just for initialising
            id: 0,
            name: ''
        }
        this.state = {
            isOpen: false,
            newIngred: '',
            selected: temp,
        }
    }

    addIngred(){ //create new ingredient dialog
        return(
        <Dialog
            open={this.state.isOpen}
                onClose={() => this.setState({ isOpen: false })}
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

    handleAddIngred(){ //adds ingredient to ingredients list
        const client = new Client();
        client.addIngredient(this.state.newIngred)
            .then((msg) => {
                //alert(msg.status);
                if (msg.status === 200) {
                    alert('Success');
                    this.setState({ isOpen: false });
                    this.props.update();
                } else {
                    alert(msg.statusText);
                }
            }).catch((status) => {
                console.log(status);
            });
    }

    handleDeleteIngred(){ //deletes ingredient from ingredient list
        const client = new Client();
        client.deleteIngredient(this.state.selected.id)
            .then((msg) => {
                if (msg.status === 200) {
                    alert('Success');
                    this.props.update();
                } else {
                    alert(msg.statusText);
                }
            }).catch((status) => {
                console.log(status);
            });
    }

    render(){
        return (
            <Dialog
                open={this.props.isOpen}
                onClose={() => this.props.setIsOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                {this.addIngred()}
                <DialogTitle id="alert-dialog-title">{"Edit Ingredients"}</DialogTitle>
                <DialogContent>

                <FormControl component="fieldset" >
                    <RadioGroup row aria-label="position" name="position" value={this.state.selected.name}>
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