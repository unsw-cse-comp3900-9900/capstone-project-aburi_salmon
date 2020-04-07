import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText,Radio, DialogActions,TextField, DialogTitle, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, RadioGroup} from '@material-ui/core';
import {Categories, Ingredient} from './../../../api/models';
import {Client} from './../../../api/client';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
}

interface IState{
    isOpen: boolean,
    newIngred: string,
    ingredientsList: Array<Ingredient> | null,
    selected: Ingredient,
}

class EditIngredients extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        const temp: Ingredient = {
            id: 0,
            name: ''
        }
        this.state = {
            isOpen: false,
            newIngred: '',
            ingredientsList: null,
            selected:temp,
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
                    <Button onClick={() => this.handleAddIngred()} style={{ float: 'right' }} color="primary" autoFocus>
                        Add Ingredient
                        </Button>
                </div>
            </DialogActions>
        </Dialog>);

    }

    handleAddIngred(){
        const client = new Client();
        client.addIngredient(this.state.newIngred)
            .then((msg) => {
                //alert(msg.status);
                if (msg.status === 200) {
                    alert('Success');
                    this.componentDidMount();
                    this.setState({ isOpen: false });

    
                } else {
                    alert(msg.statusText);
                }
            }).catch((status) => {
                console.log(status);
            });

    }

    async componentDidMount() {
        const client = new Client();
        const m: Array<Ingredient> | null = await client.getIngredients();
        this.setState({ingredientsList: m});

    }

    handleDeleteIngred(){
        const client = new Client();
        client.deleteIngredient(this.state.selected.id)
            .then((msg) => {
                //alert(msg.status);
                if (msg.status === 200) {
                    alert('Success');
                    this.componentDidMount();
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
                    aria-describedby="alert-dialog-description"
                >
                    {this.addIngred()}
                    <DialogTitle id="alert-dialog-title">{"Edit Ingredients"}</DialogTitle>
                    <DialogContent>

                    <FormControl component="fieldset" >
                        <RadioGroup row aria-label="position" name="position" value={this.state.selected.name}>
                        {
                            this.state.ingredientsList && 
                                this.state.ingredientsList.map(ingredient => 
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