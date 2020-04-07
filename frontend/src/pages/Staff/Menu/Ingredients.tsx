import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions,TextField, DialogTitle, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox} from '@material-ui/core';
import {Ingredient} from './../../../api/models';
import {Client} from './../../../api/client';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
}

interface IState{
    ingredientsList: Array<Ingredient> | null
}
class Ingredients extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            ingredientsList: null
        }
    }

    async componentDidMount() {
        const client = new Client();
        const m: Array<Ingredient> | null = await client.getIngredients();
        this.setState({ ingredientsList: m });

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
                                {
                                    this.state.ingredientsList &&
                                    this.state.ingredientsList.map(ingredient =>
                                        
                                        <FormControlLabel
                                            control={<Checkbox color="primary" value={ingredient.name} />}
                                            label={ingredient.name}
                                            key={ingredient.id}
                                        />
                                    )
                                }
                             </FormGroup>
                            
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <div style={{width:'100%'}}>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary" style={{float: 'left'}}>
                            Nevermind
                        </Button>
                        
                        <Button onClick={() => this.props.relevantFunction()} style={{float:'right'}} color="primary" autoFocus>
                            Update
                        </Button>
                        </div>
                    </DialogActions>
                </Dialog>

        );

    }
}

export default Ingredients;