import React from 'react';
import { Button, Dialog, DialogContent,  DialogActions, DialogTitle, TextField, FormControl, InputLabel, NativeSelect} from '@material-ui/core';
import {Item, Menu, WholeItemList, Categories} from './../../../api/models';
import {Client} from './../../../api/client';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    wholemenu: Menu | null,
}

interface IState{
    allItems: WholeItemList | null,
    currItem: number,
    currCat: number,
}



class AddItemCat extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            allItems: null,
            currItem: 0,
            currCat: 0,
        }
    }

    async componentDidMount(){
        const client = new Client();
        const i: WholeItemList| null = await client.getAllItems();
        if (i !== null){
            this.setState({allItems: i});
        }
        console.log(i);
    }

    handleClick(){
        console.log(this.state.currItem);
        console.log(this.state.currCat);
        const client = new Client();
        const r =  client.addItemToCat(0,this.state.currCat, this.state.currItem)
            r.then((msg) => {
                //alert(msg.status);
                if (msg.status === 200) {
                    alert('Success');
                    this.props.setIsOpen(false);
             
                } else {
                    alert(msg.statusText);
                }
            }).catch((status) => {
                console.log(status);
            });
    }

    render() {
 
            return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Add Item to Category"}</DialogTitle>
                    <DialogContent>
                          <FormControl style={{ minWidth: 150, margin: '10px' }}>
                            <InputLabel htmlFor="uncontrolled-native">Item</InputLabel>
                            <NativeSelect
                                defaultValue={1}
                                onChange={(e) => this.setState({currItem:parseInt(e.target.value) })}
                            >
                                {this.state.allItems && this.state.allItems?.items &&
                                    this.state.allItems?.items.map(item =>
                                        <option value={item.id} key={item.id}>{item.name}</option>
                                    )
                                }
                    
                            </NativeSelect>
                        </FormControl>
                        <FormControl style={{ minWidth: 150, margin: '10px' }}>
                            <InputLabel htmlFor="uncontrolled-native">Category</InputLabel>
                            <NativeSelect
                                defaultValue={1}
                                onChange={(e) => this.setState({ currCat:parseInt(e.target.value) })}
                            >
                                {this.props.wholemenu && this.props.wholemenu?.menu &&
                                    this.props.wholemenu?.menu.map(category =>
                                        <option value={category.id} key={category.id}>{category.name}</option>
                                    )
                                }
                            </NativeSelect>
                        </FormControl>  
                    </DialogContent>
                    <DialogActions>
                        <div style={{width: '100%'}}>
                            <Button onClick={() => this.props.setIsOpen(false) } style={{float:'left'}} color="primary">
                            Nevermind
                        </Button>
                        <Button style={{float:'right'}} color="primary" autoFocus onClick={() => this.handleClick()}> 
                            Add
                        </Button>
                        </div>
                    </DialogActions>
                </Dialog>
                
            );
    }

}

export default AddItemCat;