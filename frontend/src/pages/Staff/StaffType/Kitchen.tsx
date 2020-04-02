import React from 'react';
import { createStyles, withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, Box, Dialog, DialogTitle, DialogContent,DialogActions,Button} from '@material-ui/core';
import Queue from './../../Staff/Orders/QueueList';
import Cooking from './../../Staff/Orders/CookingList';
import Ready from './../../Staff/Orders/ReadyList';
import { ListItem } from './../../../api/models';
import { ItemList } from './../../../api/models';
import { Client } from './../../../api/client';
import {Menu} from './../../Menu/Menu';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            alignItems: 'flex-start',
            height: '85vh',
        },
        menubutton: {
            marginRight: theme.spacing(1),
            paddingRight: '10px',
        },
        root: {
            display: 'flex',
        },
        staffContainer: {
            backgroundColor: 'white',
            border: '2px solid darkblue',
            padding: theme.spacing(2),
            flexGrow: 1,
            display: 'flex',
            top: theme.spacing(2),
            left: theme.spacing(2),
            alignSelf: 'stretch',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(2),
            overflow: 'auto',
        },
        menuContainer: {
            backgroundColor: 'lightgrey',
            border: '2px solid darkblue',
            padding: theme.spacing(2),
            flexGrow: 1,
            display: 'flex',
            top: theme.spacing(2),
            left: theme.spacing(2),
            alignSelf: 'stretch',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(2),
            overflow: 'auto',
        },
        minSize: {
            width: theme.spacing(17),
        },
        helpIcon: {
            float: 'right',
            paddingRight: '1%',
        },
    });
export interface IProps extends WithStyles<typeof styles> { }

interface IState {
    currPage: string,
    queueList: ItemList | null,
    cookingList: ItemList | null,
    readyList: ItemList | null,
    lastClicked: number,
    resetOpen: boolean,
}

class Kitchen extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props);
        this.state = {
            currPage: "Orders",
            queueList: null, //listType === 1
            cookingList: null, //listType === 2
            readyList: null, //listType === 3
            lastClicked: -1,
            resetOpen: false,
        }
        this.moveToCooking = this.moveToCooking.bind(this);
        this.moveToReady = this.moveToReady.bind(this);
        this.moveToQueue = this.moveToQueue.bind(this);
    }

    async componentDidMount() {
        const client = new Client();
        const queue: ItemList | null = await client.getListItem(1);
        const cooking: ItemList | null = await client.getListItem(2);
        const ready: ItemList | null = await client.getListItem(3);
        this.setState({
            queueList: queue,
            cookingList: cooking,
            readyList: ready,
        });
    }

   displayCont() {
        const { classes } = this.props;
        if (this.state.currPage === "Orders") {
            return (
                <Box className={classes.staffContainer}>
                    {this.helpDialog()}
                    <Queue update={this.moveToCooking} someList={this.state.queueList} lastClicked={this.state.lastClicked}/>
                    <Cooking update={this.moveToReady} someList={this.state.cookingList} lastClicked={this.state.lastClicked}/>
                    <Ready update={this.moveToQueue} someList={this.state.readyList} lastClicked={this.state.lastClicked}/>
                    <div className={this.props.classes.helpIcon} onClick={() => this.setState({ resetOpen: true })}><HelpOutlineIcon /></div>
                </Box>
            );
        } else {
            return (
                <Box className={classes.menuContainer}>
                    <Menu />
                </Box>
            );
        }
    }

    helpDialog() {
        return (
            <div>
                <Dialog open={this.state.resetOpen} onClose={() => this.setState({ resetOpen: false })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Help</DialogTitle>
                    <DialogContent>
                        Tap on item in each list to move it between lists. If item has successfully changed list, the item will appear in the new list with a bold
                        outline.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ resetOpen: false })} color="primary">
                            Ok, I get it
                        </Button>

                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    displayNav() {
        return (
            <div className={this.props.classes.root}>
                <Paper className={this.props.classes.menubutton}>
                    <MenuList className={this.props.classes.minSize}>
                        <MenuItem onClick={() => { this.setState({ currPage: "Menu" }) }}>Menu</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Orders" }) }}>Orders</MenuItem>
                    </MenuList>
                </Paper>
            </div>
        );
    }

    moveToCooking(itemId:number, item: ListItem):void{
        var tempList = this.state.cookingList;
        if (tempList !== null) {
            const tempArray = tempList?.itemList.concat(item);
            var ret: ItemList = {
                itemList: tempArray,
            }
            this.setState({ cookingList: ret });
            
            const client = new Client();
            client.updateOrderStatus(item.id, 2)
                .then((msg) => {
                    //alert(msg.status);
                    if (msg.status === 200) {
                        this.setState({ lastClicked: item.id });
                        //alert('success');
                    } else {
                        alert(msg.statusText);
                    }
                }).catch((status) => {
                    console.log(status);
                });;
            console.log(ret);
        }   
        console.log(item);
        this.removeItem(itemId, 1);
    }

    moveToReady(itemId: number, item: ListItem): void {
        var tempList = this.state.readyList;
        if (tempList !== null){
            const tempArray= tempList?.itemList.concat(item);
            var ret: ItemList = {
                itemList: tempArray,
            }
            this.setState({readyList: ret});
            
            const client = new Client();
            client.updateOrderStatus(item.id, 3)
                .then((msg) => {
                    //alert(msg.status);
                    if (msg.status === 200) {
                        this.setState({lastClicked: item.id});
                        //alert('success');
                    } else {
                        alert(msg.statusText);
                    }
                }).catch((status) => {
                    console.log(status);
                });;
        }  
        console.log(item);
        this.removeItem(itemId, 2);
    }

    moveToQueue(itemId: number, item: ListItem): void {
        var tempList = this.state.queueList;
        if (tempList !== null) {
            const tempArray = tempList?.itemList.concat(item);
            var ret: ItemList = {
                itemList: tempArray,
            }
            this.setState({ queueList: ret });
            
            const client = new Client();
            client.updateOrderStatus(item.id, 1)
                .then((msg) => {
                    //alert(msg.status);
                    if (msg.status === 200) {
                        this.setState({ lastClicked: item.id });
                        //alert('success');
                    } else {
                        alert(msg.statusText);
                    }
                }).catch((status) => {
                    console.log(status);
                });;
        }   
        console.log(item);
        this.removeItem(itemId, 3);
    }

    removeItem(itemKey: number, listType: number): void {
        if (listType === 1){
            var array1 = this.state.queueList;
            array1?.itemList.splice(itemKey, 1);
            this.setState({ queueList: array1 });
            console.log(this.state.queueList);
        } else if (listType === 2){
            var array2 = this.state.cookingList;
            array2?.itemList.splice(itemKey, 1);
            this.setState({ cookingList: array2 });
            console.log(this.state.cookingList);
        } else if (listType === 3){
            var array3 = this.state.readyList;
            array3?.itemList.splice(itemKey, 1);
            this.setState({ readyList: array3 });
            console.log(this.state.readyList);
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                {this.displayNav()}
                {this.displayCont()}
            </div>
        );
    }
}

export const KitchenStaff = withStyles(styles)(Kitchen);