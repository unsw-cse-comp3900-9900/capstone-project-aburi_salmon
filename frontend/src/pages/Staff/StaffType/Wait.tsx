import React from 'react';
import { createStyles,  withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, Box, Snackbar, Button, Dialog, DialogTitle, DialogContent,DialogActions } from '@material-ui/core';
import Assistance from './Assistance/AssistanceMain';
import ToServe from './Orders/Components/ToServeList';
import Served from './Orders/Components/ServedList';
import { ListItem, Menu, Tables, AssistanceTables, ItemList} from './../../../api/models';
import { Client } from './../../../api/client';
import { Alert } from '@material-ui/lab';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {StaticMenu } from './Menu/StaticMenu';

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
            minWidth: '800px',
        },
        helpIcon: {
            float: 'right',
            paddingRight: '1%',
        },
        minSize: {
            width: theme.spacing(17),

        },

    });
export interface IProps extends WithStyles<typeof styles> { }

interface IState{
    currPage: string,
    toServeList: ItemList | null,
    servedList: ItemList | null,
    listName: string,
    isOpen: boolean,
    lastClicked: number,
    resetOpen: boolean,

    //initialise menu
    menu: Menu | null;
    menuvalue: string;

    //initialise assistance
    tables: Tables | null,
    assistance: Array<number>, 
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

            menu: null,
            menuvalue: '',

            tables: null,
            assistance: [],
        }
        this.moveToServed = this.moveToServed.bind(this);
        this.moveToToServe = this.moveToToServe.bind(this);
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

    async componentDidMount() {
        const client = new Client();
        const toServe: ItemList | null = await client.getListItem(3);
        const served: ItemList | null = await client.getListItem(4);
        //menu
        const m: Menu | null = await client.getMenu();
        //assistance
        const t: Tables | null = await client.getTables();
        const a: AssistanceTables | null = await client.getAssistanceTable();
        var temp: Array<number> = [];

        if (a?.tables !== undefined) {
            a?.tables.map(it => {
                temp.push(it.table_id);
            }
            )
            this.setState({ assistance: temp });
        }

        this.setState({
            toServeList: toServe,
            servedList: served,
            menu: m,
            menuvalue: m?.menu[0].name ? m?.menu[0].name : "",
            tables: t,
        });
    }

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
                    <Assistance tables={this.state.tables} assistance={this.state.assistance}/>
                </Box>
            );
        } else {
            return(
                <Box className={classes.menuContainer}>
                    <StaticMenu menu={this.state.menu} value={this.state.menuvalue}/>
                </Box>
            );
        }
    }

    moveToServed(itemId: number, item: ListItem): void {
        var tempList = this.state.servedList;
        if (tempList !== null) {
            const tempArray = tempList?.itemList.concat(item);
            var ret: ItemList = {
                itemList: tempArray,
            }
            this.setState({ servedList: ret });
            
            const client = new Client();
            client.updateOrderStatus(item.id, 4)
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
        this.removeItem(itemId, 1);
    }

    moveToToServe(itemId: number, item: ListItem): void {
        var tempList = this.state.toServeList;
        if (tempList !== null) {
            const tempArray = tempList?.itemList.concat(item);
            var ret: ItemList = {
                itemList: tempArray,
            }
            this.setState({ toServeList: ret });
            
            const client = new Client();
            client.updateOrderStatus(item.id, 3)
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
        this.removeItem(itemId, 2);
    }

    removeItem(itemKey: number, listType: number): void {
        if (listType === 1) {
            var array1 = this.state.toServeList;
            array1?.itemList.splice(itemKey, 1);
            this.setState({ toServeList: array1 });
            console.log(this.state.toServeList);
        } else if (listType === 2) {
            var array2 = this.state.servedList;
            array2?.itemList.splice(itemKey, 1);
            this.setState({ servedList: array2 });
            console.log(this.state.servedList);
        }
    }

    showAlert(){
        return(
            <Snackbar
                open={this.state.isOpen}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={() => this.setState({ isOpen: false })}>
                            OK
                            </Button>
                    }
                >Assistance Required!!!</Alert>
            </Snackbar>
        );
    }

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