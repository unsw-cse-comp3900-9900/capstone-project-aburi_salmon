import React from 'react';
import { createStyles, withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, ListItemIcon, Box } from '@material-ui/core';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import Queue from './../../Staff/Orders/QueueList';
import Cooking from './../../Staff/Orders/CookingList';
import Ready from './../../Staff/Orders/ReadyList';
import {ListItem} from './../../../api/models';
import { ItemList } from './../../../api/models';
import { Client } from './../../../api/client';

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
        },
    });
export interface IProps extends WithStyles<typeof styles> { }

interface IState {
    currPage: string,
    queueList: ItemList | null,
    cookingList: ItemList | null,
    readyList: ItemList | null,
    listName: string
}

class Kitchen extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props);
        this.state = {
            currPage: "Orders",
            listName: "none",
            queueList: null, //listType === 1
            cookingList: null, //listType === 2
            readyList: null, //listType === 3
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
        console.log('queuelist: ' + queue);
        console.log('cookinglist: ' + cooking);
        console.log('readylist: ' + ready);
    }

   displayCont() {
        const { classes } = this.props;
        if (this.state.currPage === "Orders") {
            return (
                <Box className={classes.staffContainer}>
                    <Queue update={this.moveToCooking} someList={this.state.queueList}/>
                    <Cooking update={this.moveToReady} someList={this.state.cookingList} />
                    <Ready update={this.moveToQueue} someList={this.state.readyList} />
                </Box>
            );
        } else {
            return (
                <Box className={classes.staffContainer}>
                    <h1> Menu should be here</h1>
                </Box>
            );
        }
    }

    displayNav() {
        return (
            <div className={this.props.classes.root}>
                <Paper className={this.props.classes.menubutton}>
                    <MenuList >
                        <MenuItem onClick={() => { this.setState({ currPage: "Menu" }) }}>Menu</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Orders" }) }}>Orders
                            <ListItemIcon>
                                <PriorityHighIcon fontSize="small" />
                            </ListItemIcon>
                        </MenuItem>
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
            var array1 = this.state.cookingList;
            array1?.itemList.splice(itemKey, 1);
            this.setState({ cookingList: array1 });
            console.log(this.state.cookingList);
        } else if (listType === 3){
            var array1 = this.state.readyList;
            array1?.itemList.splice(itemKey, 1);
            this.setState({ readyList: array1 });
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