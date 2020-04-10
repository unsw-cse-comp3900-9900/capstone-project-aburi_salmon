import React from 'react';
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, FormControl, FormGroup, FormControlLabel, Checkbox} from '@material-ui/core';
import {Ingredient, Item} from './../../../../../api/models';
import { Client} from './../../../../../api/client';

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

    async addAll(){
        const client = new Client();
        var r;
        this.state.ingredientsId.forEach(async (id, index) => {
            if (this.state.selected[index] === true && this.props.itemIngredients.indexOf(id) === -1){
                r = client.addIngredToItem(this.props.currItem.id, id);
            } else if (this.props.itemIngredients.indexOf(id) !== -1 && this.state.selected[index] === false){
                r = client.removeIngredFromItem(this.props.currItem.id, id);
            }
        });
        return r;
    }

    async updateIngredients(){ //update ingredient in an item
        const r = await this.addAll();
        this.props.alert(true, 'success', 'Success');
        this.props.update();
        this.props.setIsOpen(false);
        this.props.setModalIsOpen(false);
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

    whenOpened(){
        this.setState({ ingredientsId: [], selected: [] });
        var temp: Array<boolean> = [];
        var temp2: Array<number> = [];
        this.props.ingredientsList?.forEach(ingredient =>{
            if (this.props.itemIngredients.indexOf(ingredient.id) !== -1) {
                temp.push(true);
            } else {
                temp.push(false);
            }
            temp2.push(ingredient.id);
        });
        console.log('entered when opened');
        console.log(this.props.itemIngredients);
        this.setState({ selected: temp, ingredientsId: temp2 });
    }

    componentDidUpdate( prevProps: any,prevState: any){
        console.log(prevProps.itemIngredients);
        console.log(this.props.itemIngredients);
        if (prevProps.itemIngredients !== this.props.itemIngredients){
            if (this.props.itemIngredients.length !== 0 ){
                this.whenOpened();
                this.forceUpdate();
            }
        }
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
                                this.props.ingredientsList.map((ingredient, index) => this.printIngred(ingredient, index))
                            }
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <div style={{ width: '100%' }}>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary" style={{ float: 'left' }}>
                            Nevermind
                    </Button>

                        <Button onClick={() => this.updateIngredients()} style={{ float: 'right' }} color="primary" autoFocus>
                            Update
                    </Button>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}

export default Ingredients;