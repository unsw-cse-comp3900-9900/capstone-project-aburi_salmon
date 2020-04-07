import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions,TextField, DialogTitle, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox} from '@material-ui/core';
import {Ingredient, Item} from './../../../api/models';
import {Client} from './../../../api/client';
import { totalmem } from 'os';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
    currItem: Item,
    itemIngredients: Array<number>,
}

interface IState{
    ingredientsList: Array<Ingredient> | null,
    selectedIngredients: Array<number>,
}
class Ingredients extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            ingredientsList: null,
            selectedIngredients: [], //checked
        }
    }

    async componentDidMount() {
        const client = new Client();
        const m: Array<Ingredient> | null = await client.getIngredients();
        this.setState({ ingredientsList: m });

    }

    printIngred(ingredient: Ingredient){
        return(
            <FormControlLabel
                control={<Checkbox color="primary" 
                    onChange={(e) => this.handleCheck(e.target.value)}
                value={ingredient.id} />}
                label={ingredient.name}
                key={ingredient.id}
            />
        );
    }

    updateIngredients(){
        console.log(this.state.selectedIngredients);
    }

    handleCheck(value: string) {
        var temp = this.state.selectedIngredients;
        var num = this.state.selectedIngredients.indexOf(parseInt(value));
        
        if (num !== -1){
            temp.splice(num, 1);
        } else {
            temp.push(parseInt(value));
        }

        this.setState({selectedIngredients: temp});
    }

    close(){
        this.props.setIsOpen(false);
        this.setState({selectedIngredients: []});
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
                                    this.state.ingredientsList.map(ingredient => this.printIngred(ingredient))
                                }
                             </FormGroup>
                            
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <div style={{width:'100%'}}>
                        <Button onClick={() => this.close()} color="primary" style={{float: 'left'}}>
                            Nevermind
                        </Button>
                        
                        <Button onClick={() => this.updateIngredients()} style={{float:'right'}} color="primary" autoFocus>
                            Update
                        </Button>
                        </div>
                    </DialogActions>
                </Dialog>

        );

    }
}

export default Ingredients;