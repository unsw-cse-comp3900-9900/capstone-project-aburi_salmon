import React from 'react';
import {  withStyles, WithStyles, MenuList, Paper, MenuItem, Box, Dialog, DialogTitle, DialogContent,DialogActions,Button} from '@material-ui/core';
import { ListItem, Menu, ItemList, ResponseMessage } from './../../../api/models';
import { Client } from './../../../api/client';
import { StaticMenu} from './Menu/StaticMenu';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { socket, kitchenSocket } from '../../../api/socketio';
import {styles} from './styles';
import OrderContainer from './Orders/Components/OrderContainer';

// This loads all the pages that the kitchen staff sees
// This includes the menu and list of orders
// It is the brain of the system, it keeps track of all the states
// It is responsible for communicating with the server as well

export interface IProps extends WithStyles<typeof styles> { }

interface IState {
    currPage: string,
    //orders
    queueList: ItemList | null,
    cookingList: ItemList | null,
    readyList: ItemList | null,
    lastClicked: number, //id of last item clicked/moved

    //helpDialog
    helpOpen: boolean,     //is help dialog open
    
    //preventDuplicates
    preventDups: ListItem | null,
    noDups: 'none' | 'queue' | 'cooking' | 'ready', //last entered list

    //initialise menu
    menu: Menu | null;
    menuvalue: string;
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

            helpOpen: false,
            preventDups: null,
            noDups: 'none',

            menu: null,
            menuvalue: '',
        }
        //moving items between lists
        this.moveToCooking = this.moveToCooking.bind(this);
        this.moveToReady = this.moveToReady.bind(this);
        this.moveToQueue = this.moveToQueue.bind(this);

        //For menu
        this.changeMenuValue = this.changeMenuValue.bind(this);

        //Binding
        this.updateOrders = this.updateOrders.bind(this);
        this.updateMenu = this.updateMenu.bind(this);
    }

    async componentDidMount() {
        //connect to socket for real time updates
        kitchenSocket(this);
        //initialise orders lists
        this.updateOrders();
    }

    async updateOrders(){
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

    async updateMenu(){
        const client = new Client();
        const m: Menu | null = await client.getMenu();
        this.setState({
            menu: m,
            menuvalue: m?.menu[0].name ? m?.menu[0].name : "",
        });
    }

    //displays pages
   displayCont() {
        const { classes } = this.props;
        if (this.state.currPage === "Orders") {
            return (
                <Box className={classes.staffContainer}>
                    {this.helpDialog()}
                    <OrderContainer update={this.moveToCooking} someList={this.state.queueList} lastClicked={this.state.lastClicked}
                            headingStyle={this.props.classes.headingQueue} boxStyle={this.props.classes.boxQueue} name="Queue"/>
                    <OrderContainer update={this.moveToReady} someList={this.state.cookingList} lastClicked={this.state.lastClicked}
                        headingStyle={this.props.classes.headingToBeServed} boxStyle={this.props.classes.boxToBeServed} name="Cooking"/>
                    <OrderContainer update={this.moveToQueue} someList={this.state.readyList} lastClicked={this.state.lastClicked}
                        headingStyle={this.props.classes.headingServed} boxStyle={this.props.classes.boxServed} name="Ready"/>
                    <div className={this.props.classes.helpIcon} onClick={() => this.setState({ helpOpen: true })}><HelpOutlineIcon /></div>
                </Box>
            );
        } else {
            if (this.state.menu === null) {
                this.updateMenu();
                var tempMenu: Menu = {
                    menu: [],
                }
                this.setState({ menu: tempMenu });
                console.log('Getting Menu');
            }
            return (
                <Box className={classes.menuContainer}>
                    <StaticMenu menu={this.state.menu} value={this.state.menuvalue} changeValue={this.changeMenuValue}/>
                </Box>
            );
        }
    }

    changeMenuValue(newValue: string){
        this.setState({menuvalue: newValue})
    }

    //renders help dialog
    helpDialog() {
        return (
            <div>
                <Dialog open={this.state.helpOpen} onClose={() => this.setState({ helpOpen: false })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Help</DialogTitle>
                    <DialogContent>
                        Tap on item in each list to move it between lists. If item has successfully changed list, the item will appear in the new list with a bold
                        outline.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ helpOpen: false })} color="primary">
                            Ok, I get it
                        </Button>

                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    //display navigation bar
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

    //move item from queue to cooking
    async moveToCooking(itemId:number, item: ListItem){
        var tempList = this.state.cookingList;
        if (tempList !== null) {
            if (!(this.state.preventDups === item && this.state.noDups ==='cooking')){
                this.setState({noDups: 'cooking' });
                const tempArray = tempList?.itemList.concat(item);
                this.setState({preventDups: item});
                var ret: ItemList = {
                    itemList: tempArray,
                }
                this.setState({ cookingList: ret });
                
                const client = new Client();
                const r: ResponseMessage | null = await client.updateOrderStatus(item.id, 2);
                if (r?.status === "success") {
                    this.setState({ lastClicked: item.id});
                }
            }
        }   
        this.removeItem(itemId, 1);
    }

    //move item from cooking to ready
    async moveToReady(itemId: number, item: ListItem){
        var tempList = this.state.readyList;
        if (tempList !== null ){
            if (!(this.state.preventDups === item && this.state.noDups === 'ready')) {
                this.setState({ noDups: 'ready' });
                const tempArray= tempList?.itemList.concat(item);
                this.setState({preventDups: item});
                var ret: ItemList = {
                    itemList: tempArray,
                }
                this.setState({readyList: ret});
                
                const client = new Client();
                const r: ResponseMessage | null = await client.updateOrderStatus(item.id, 3);
                if (r?.status === "success") {
                    this.setState({ lastClicked: item.id });
                }
            }
        }  
        this.removeItem(itemId, 2);
    }

    //move item from ready to queue
    async moveToQueue(itemId: number, item: ListItem){
        var tempList = this.state.queueList;
        if (tempList !== null) {
            if (!(this.state.preventDups === item && this.state.noDups === 'queue')) {
                this.setState({ noDups: 'queue' });
                const tempArray = tempList?.itemList.concat(item);
                this.setState({preventDups: item});
                var ret: ItemList = {
                    itemList: tempArray,
                }
                this.setState({ queueList: ret });
                
                const client = new Client();
                const r: ResponseMessage | null = await client.updateOrderStatus(item.id, 1);
                if (r?.status === "success") {
                    this.setState({ lastClicked: item.id});
                }
            }
        }   
        this.removeItem(itemId, 3);
    }

    //remove item from list
    removeItem(itemKey: number, listType: number): void {
        if (listType === 1){
            var array1 = this.state.queueList;
            array1?.itemList.splice(itemKey, 1);
            this.setState({ queueList: array1 });
        } else if (listType === 2){
            var array2 = this.state.cookingList;
            array2?.itemList.splice(itemKey, 1);
            this.setState({ cookingList: array2 });
        } else if (listType === 3){
            var array3 = this.state.readyList;
            array3?.itemList.splice(itemKey, 1);
            this.setState({ readyList: array3 });
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