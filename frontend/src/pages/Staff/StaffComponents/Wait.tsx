import React from 'react';
import { withStyles, WithStyles, MenuList, Paper, MenuItem, Box, Snackbar, Button, Dialog, DialogTitle, DialogContent,DialogActions } from '@material-ui/core';
import Assistance from './Assistance/AssistanceMain';
import ToServe from './Orders/Components/ToServeList';
import Served from './Orders/Components/ServedList';
import { ListItem, Menu, Tables, AssistanceTables, ItemList, ResponseMessage, Bill} from './../../../api/models';
import { Client } from './../../../api/client';
import { Alert } from '@material-ui/lab';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {StaticMenu } from './Menu/StaticMenu';
import {styles} from './styles';
import { manageWaitSocket } from '../../../api/socketio';

// This loads all the pages that the kitchen staff sees
// This includes the menu, list of orders, and info on tables
// It is the brain of the system, it keeps track of all the states
// It is responsible for communicating with the server as well

export interface IProps extends WithStyles<typeof styles> { }

interface IState{
    currPage: string,
    toServeList: ItemList | null,
    servedList: ItemList | null,
    listName: string,
    isOpen: boolean,
    lastClicked: number,
    resetOpen: boolean,

    //prevent duplicates in lists
    noDups: 'none' | 'served' | 'toBeServed'  //last entered list
    preventDups: ListItem | null,

    //for alert messages
    alertMessage: string,

    //initialise menu
    menu: Menu | null;
    menuvalue: string;

    //initialise assistance
    tables: Tables | null,
    assistance: Array<number>, 
    bill: Array<number>
}

class Wait extends React.Component<IProps, IState>{

    constructor(props: any){
        super(props);
        this.state = {
            currPage: "Orders",
            listName: "none",
            toServeList: null,
            servedList: null,
            isOpen: false,
            lastClicked: -1,
            resetOpen: false,

            noDups: 'none',
            preventDups: null,

            alertMessage: 'Something went wrong',

            menu: null,
            menuvalue: '',

            tables: null,
            assistance: [],
            bill: [],
        }
        this.moveToServed = this.moveToServed.bind(this);
        this.moveToToServe = this.moveToToServe.bind(this);
        this.changeMenuValue = this.changeMenuValue.bind(this);
        this.updateAssist = this.updateAssist.bind(this);
        this.updateOrders = this.updateOrders.bind(this);

        this.billrequestAlert = this.billrequestAlert.bind(this);
        this.assistanceAlert = this.assistanceAlert.bind(this);
        
    }

    billrequestAlert(){
        this.setState({alertMessage: 'Bill was requested!!'});
        this.updateAssist();
        this.showAlert();
    }

    assistanceAlert(){
        this.setState({ alertMessage: 'Assistance was requested!!'});
        this.showAlert();
    }

    async componentDidMount() {
        //connect to socket for real time data
        manageWaitSocket(this);
        //initialise orders and assistance page
        this.updateOrders();
        this.updateAssist();
    }

    async updateMenu(){
        const client = new Client();
        const m: Menu | null = await client.getMenu();
        this.setState({
            menu: m,
            menuvalue: m?.menu[0].name ? m?.menu[0].name : "",
        });
    }

    async updateOrders(){
        const client = new Client();
        const toServe: ItemList | null = await client.getListItem(3);
        const served: ItemList | null = await client.getListItem(4);
        this.setState({
            toServeList: toServe,
            servedList: served,
        });
    }

    async updateAssist(){
        const client = new Client()
        const t: Tables| null = await client.getTables();
        const a: AssistanceTables | null = await client.getAssistanceTable();
        const b: Bill | null = await client.getBill();
        var temp: Array<number> = [];
        if (a?.tables !== undefined) {
            a?.tables.forEach(it => {
                temp.push(it.table_id);
            }
            )
            this.setState({ assistance: temp });
        }
        if (b !== null) {
            this.setState({ bill: b.tables });
        }
        this.setState({ tables: t });
    }

    //for loading menu
    changeMenuValue(newValue: string) {
        this.setState({ menuvalue: newValue })
    }

    //move item from to be served to served
    async moveToServed(itemId: number, item: ListItem) {
        var tempList = this.state.servedList;
        if (tempList !== null) {
            if (!(this.state.preventDups === item && this.state.noDups === 'served')) {
                this.setState({ noDups: 'served' });
                const tempArray = tempList?.itemList.concat(item);
                this.setState({preventDups: item});
                var ret: ItemList = {
                    itemList: tempArray,
                }
                this.setState({ servedList: ret });
                const client = new Client();
                const r: ResponseMessage | null = await client.updateOrderStatus(item.id, 4);
                if (r?.status === "success") {
                    this.setState({ lastClicked: item.id });
                }
            }
        }
        this.removeItem(itemId, 1);
    }

    //move item from served to, to be served
    async moveToToServe(itemId: number, item: ListItem){
        var tempList = this.state.toServeList;
        if (tempList !== null && item) {
            if (!(this.state.preventDups === item && this.state.noDups === 'toBeServed')) {
                this.setState({ noDups: 'toBeServed' });
                const tempArray = tempList?.itemList.concat(item);
                this.setState({preventDups: item});
                var ret: ItemList = {
                    itemList: tempArray,
                }
                this.setState({ toServeList: ret });
                
                const client = new Client();
                const r: ResponseMessage | null = await client.updateOrderStatus(item.id, 3);
                if (r?.status === "success") {
                    this.setState({ lastClicked: item.id });
                }
            }
        }
        this.removeItem(itemId, 2);
    }

    //remove item from list
    removeItem(itemKey: number, listType: number): void {
        if (listType === 1) {
            var array1 = this.state.toServeList;
            array1?.itemList.splice(itemKey, 1);
            this.setState({ toServeList: array1 });
        } else if (listType === 2) {
            var array2 = this.state.servedList;
            array2?.itemList.splice(itemKey, 1);
            this.setState({ servedList: array2 });
        }
    }

    // shows help dialog
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

    //shows the alert
    showAlert(){
        return(
            <Snackbar
                open={this.state.isOpen}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    severity="error"
                    action={
                    <Button color="inherit" size="small" onClick={() => this.setState({ isOpen: false })}>
                        OK
                    </Button>
                    }>{this.state.alertMessage}</Alert>
            </Snackbar>
        );
    }

    //diplays the pages
    displayCont(){
        const { classes } = this.props;
        if (this.state.currPage === "Orders") {
            return (
                <Box className={classes.staffContainer}>
                    {this.helpDialog()}
                    <ToServe update={this.moveToServed} someList={this.state.toServeList} lastClicked={this.state.lastClicked}/>
                    <Served update={this.moveToToServe} someList={this.state.servedList} lastClicked={this.state.lastClicked}/>
                    <div className={this.props.classes.helpIcon} onClick={() => this.setState({ resetOpen: true })}><HelpOutlineIcon /></div>
                </Box>
            );
        } else if (this.state.currPage === "Assistance"){
            return (
                <Box className={classes.staffContainer}>
                    <Assistance tables={this.state.tables} assistance={this.state.assistance}
                    update={this.updateAssist} billRequest={this.state.bill}/>
                </Box>
            );
        } else {
            if (this.state.menu === null) {
                this.updateMenu();
                var tempMenu: Menu = {
                    menu: [],
                }
                this.setState({ menu: tempMenu });
            }
            return(
                <Box className={classes.menuContainer}>
                    <StaticMenu menu={this.state.menu} value={this.state.menuvalue} changeValue={this.changeMenuValue}/>
                </Box>
            );
        }
    }

    // displays the navigation bar
    displayNav(){
        return(
            <div className={this.props.classes.root}>
                {this.showAlert()}
                <Paper className={this.props.classes.menubutton}>
                    <MenuList className={this.props.classes.minSize}>
                        <MenuItem onClick={() => { this.setState({ currPage: "Menu" }) }}>Menu</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Orders" }) }}>Orders</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Assistance" }) }}>Tables</MenuItem>
                    </MenuList>
                </Paper>
            </div>
        );
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

export const WaitStaff =  withStyles(styles)(Wait);