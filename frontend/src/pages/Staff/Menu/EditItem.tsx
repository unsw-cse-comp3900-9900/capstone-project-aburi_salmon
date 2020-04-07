import React from 'react';
import { Button, Dialog, DialogContent,  DialogActions, DialogTitle, TextField, FormControl, InputLabel, NativeSelect} from '@material-ui/core';
import {Item, Menu} from './../../../api/models';


export interface IProps{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    relevantFunction: any,
    isEdit: boolean, //if 1 then it is edit, if 0 then is create new
    item: Item,
    wholemenu: Menu | null,
}

interface IState{
    name: string,
    description: string,
    price: number,
    visibility: boolean,
    category: any,
}

class EditItem extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        
        this.state = {
            name: '',
            description:'',
            price: 0,
            visibility: true,
            category: 1,
        }
        this.submitEdit = this.submitEdit.bind(this);
    }

    changeCat(value: any){
        this.setState({category: value});
        console.log(value);
    }


    submitCreate(){

        this.props.relevantFunction(this.state.name, this.state.description, this.state.price, this.state.visibility, this.state.category);
        this.setState({name:'', description: '', price:0, visibility:true, category: 1});
    }

    submitEdit(){
        console.log(this.props.item?.name);      
        if (this.state.name === ''){
            var tempname = this.props.item?.name;
            console.log('entered');
        } else {
            var tempname = this.state.name;
        }
        if (this.state.description === ''){
            var tempdes = this.props.item?.description;
        } else {
            var tempdes = this.state.description;
        }
        if (this.state.price === 0 ){
            var tempprice = this.props.item?.price;
        }else {
            var tempprice = this.state.price;
        }

        console.log(this.state.name);
        this.props.relevantFunction(tempname, tempdes, tempprice, this.state.visibility, this.state.category);
        this.setState({ name: '', description: '', price: 0, visibility: true, category: 1 });
    }

    async componentDidMount(){
        this.setState({ name: '', description: '', price: 0, visibility: true, category: 1 });
    }

    setChange(value: any){
        if (value === 'true'){
            this.setState({visibility: true});
        } else {
            this.setState({visibility: false});
        }
    }

    render() {
        if (this.props.isEdit) {    
            return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Edit Item"}</DialogTitle>
                    <DialogContent>
                            
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Enter Name"
                                fullWidth
                                onChange={(e) => this.setState({ name: e.target.value })}
                                defaultValue={this.props.item?.name}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="des"
                                label="Description <filled in>"
                                fullWidth
                                multiline={true}
                                onChange={(e) => this.setState({ description: e.target.value })}
                                defaultValue={this.props.item?.description}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="price"
                                label="Price <filled in>"
                                fullWidth
                                defaultValue={this.props.item?.price}
                                onChange={(e) => this.setState({ price: parseInt(e.target.value) })}
                            />

                        <FormControl style={{ minWidth: 150, margin: '10px' }}>
                            <InputLabel htmlFor="uncontrolled-native">Visibility</InputLabel>
                            <NativeSelect
                                defaultValue={'true'}
                                onChange={(e) => this.setChange(e.target.value)}
                            >
                                <option value={'true'}>Show</option>
                                <option value={'false'}>Hide</option>
                            </NativeSelect>
                        </FormControl>

                        <FormControl style={{ minWidth: 150, margin: '10px' }}>
                            <InputLabel htmlFor="uncontrolled-native">Category</InputLabel>
                            <NativeSelect
                                defaultValue={1}
                                onChange={(e) => this.setState({ category: e.target.value })}
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
                        <Button onClick={() => this.submitEdit()} style={{float:'right'}} color="primary" autoFocus>
                            Modify Item
                        </Button>
                        </div>
                    </DialogActions>
                </Dialog>
                
            );
        } else {
            return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Add Item"}</DialogTitle>
                    <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Enter Name"
                                fullWidth
                            onChange={(e) => this.setState({ name: e.target.value })}
                                
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="des"
                                label="Description"
                                fullWidth
                                multiline = {true}
                            onChange={(e) => this.setState({ description: e.target.value })}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="price"
                                label="Price"
                                fullWidth
                            onChange={(e) => this.setState({ price: parseInt(e.target.value) })}
                            />
                        <FormControl style={{ minWidth: 150, margin: '10px' }}>
                            <InputLabel htmlFor="uncontrolled-native">Visibility</InputLabel>
                            <NativeSelect
                                defaultValue={'true'}
                                onChange={(e) => this.setChange(e.target.value)}
                            >
                                <option value={'true'}>Show</option>
                                <option value={'false'}>Hide</option>
                            </NativeSelect>
                        </FormControl>

                        <FormControl style={{ minWidth: 150, margin: '10px' }}>
                            <InputLabel htmlFor="uncontrolled-native">Category</InputLabel>
                            <NativeSelect
                                defaultValue={1}
                                onChange={(e) => this.setState({category: e.target.value})}
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
                        <div style={{width:'100%'}}>
                        <Button onClick={() => this.props.setIsOpen(false)} style={{float: 'left'}} color="primary">
                            Nevermind
                            </Button>
                        <Button onClick={() => this.submitCreate()} style={{float:'right'}} color="primary" autoFocus>
                            Create Item
                            </Button>
                          </div>  
                    </DialogActions>
                </Dialog>
            );
        }
    }
}

export default EditItem;