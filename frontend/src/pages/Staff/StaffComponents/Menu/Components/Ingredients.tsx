import React from 'react';
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, FormControl, FormGroup, FormControlLabel, Checkbox, ThemeProvider} from '@material-ui/core';
import {Ingredient, Item} from './../../../../../api/models';
import {Client} from './../../../../../api/client';

//renders the dialog for adding ingredients to an item

export interface IProps{
    isOpen: boolean, //state of this dialog
    setIsOpen: any, //function to change state of isOpen
    currItem: Item, //current selected item
    itemIngredients: Array<number>,  //id of ingredients in item (makes life easier)
    ingredientsList: Array<Ingredient> | null, //list of all available ingredients
    setModalIsOpen: any,
    update: any, //force update menu
    alert: any,
}

interface IState{
    ingredientsId: Array<number>, //contains id of selected ingredients
    selected: Array<boolean> //index of ingredient shows if is selected
}
class Ingredients extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            ingredientsId: [], //id of ingredients selected
            selected: [],
        }
    }

    printIngred(ingredient: Ingredient, index: number){ //print the checkbox
        if (this.state.selected !== []){
            return(
                <FormControlLabel
                    control={<Checkbox color="primary" checked={this.state.selected[index]}
                        onChange={(e) => this.handleCheck(parseInt(e.target.value))}
                    value={index} />}
                    label={ingredient.name}
                    key={ingredient.id}
                />
            );
        } else {
            return (
                <FormControlLabel
                    control={<Checkbox color="primary"
                        onChange={(e) => this.handleCheck(parseInt(e.target.value))}
                        value={index} />}
                    label={ingredient.name}
                    key={ingredient.id}
                />
            );
        }
    }

    updateIngredients(){ //update ingredient in an item



        /*
        console.log(this.state.selectedIngredients);
        var i = 0;
        const client = new Client();
        var temp = this.props.itemIngredients;

        while (i < this.state.selectedIngredients.length){
            // if ingredient is not already an ingredient, add
            if (temp.indexOf(this.state.selectedIngredients[i]) === -1){
                client.addIngredToItem(this.props.currItem.id, this.state.selectedIngredients[i]);
                temp.splice(temp.indexOf(this.state.selectedIngredients[i]), 1);
            }
            i++;
            console.log(temp);
        }
        i = 0;
        while(i < temp.length){ //delete ingredients that are no longer needed from item
            client.removeIngredFromItem(this.props.currItem.id, temp[i]);
            i++;
        }
        this.props.alert(true, 'success', 'Success');
        this.props.update();
        this.props.setIsOpen(false);
        this.props.setModalIsOpen(false);*/

    }

    handleCheck(value: number){
        var temp = this.state.selected;
        if (this.state.selected[value] === true){
            temp[value] = false;
        } else {
            temp[value] = true;
        }
        this.setState({selected: temp});
    }

    //if checkbox is clicked, add to array if it isn't already.
    //if it is in array, remove it from array
    /*
    handleCheck(value: string) { 
        var temp = this.state.selectedIngredients;
        var num = this.state.selectedIngredients.indexOf(parseInt(value));
        if (num !== -1){
            temp.splice(num, 1);
        } else {
            temp.push(parseInt(value));
        }
        this.setState({selectedIngredients: temp});
    }*/

    async whenOpened(){
        this.setState({ ingredientsId: [], selected: [] });
        /*
        this.setState({ ingredientsId: [], selected: [] });
        var temp = this.state.selected;
        var temp2 = this.state.ingredientsId;
        this.props.ingredientsList?.map(ingredient =>{
            if (this.props.itemIngredients.indexOf(ingredient.id) !== -1) {
                temp.push(true);
            } else {
                temp.push(false);
            }
            temp2.push(ingredient.id);
            console.log(temp);
            console.log(temp2);
            this.setState({ selected: temp, ingredientsId: temp2 });
        });*/
    }


    render(){
        return (
            <Dialog
                open={this.props.isOpen}
                onClose={() => this.props.setIsOpen(false)}
                onEnter={() => this.whenOpened()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Edit Ingredients"}</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset" >
                        <FormGroup row={true}>
                            {
                                this.props.ingredientsList &&
                                this.props.ingredientsList.map((ingredient,index) => this.printIngred(ingredient,index))
                            }
                            </FormGroup> 
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <div style={{width:'100%'}}>
                    <Button onClick={() => this.props.setIsOpen(false)} color="primary" style={{float: 'left'}}>
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