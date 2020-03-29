import React from 'react';
import { createStyles,  withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, ListItemIcon, Box, Snackbar, Button } from '@material-ui/core';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import Assistance from './../../Staff/Assistance/AssistanceMain';
import ToServe from './../Orders/ToServeList';
import Served from './../Orders/ServedList';
import { ListItem } from './../../../api/models';
import { ItemList } from './../../../api/models';
import { Client } from './../../../api/client';
import { Alert } from '@material-ui/lab';

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

interface IState{
    currPage: string,
    toServeList: ItemList | null,
    servedList: ItemList | null,
    listName: string,
    isOpen: boolean
}

class Wait extends React.Component<IProps, IState>{

    constructor(props: any){
        super(props);
        this.state = {
            currPage: "Orders",
            listName: "none",
            toServeList: null,
            servedList: null,
            isOpen: true,
        }
        this.moveToServed = this.moveToServed.bind(this);
        this.moveToToServe = this.moveToToServe.bind(this);
    }

    async componentDidMount() {
        const client = new Client();
        const toServe: ItemList | null = await client.getListItem(3);
        const served: ItemList | null = await client.getListItem(4);
        this.setState({
            toServeList: toServe,
            servedList: served,
        });
        console.log('toServeList: ' + toServe);
        console.log('ServedList: ' + served);
    }

    displayCont(){
        const { classes } = this.props;
        if (this.state.currPage === "Orders") {
            return (
                <Box className={classes.staffContainer}>
                    <ToServe update={this.moveToServed} someList={this.state.toServeList}/>
                    <Served update={this.moveToToServe} someList={this.state.servedList}/>
                </Box>
            );
        } else if (this.state.currPage === "Assistance"){
            return (
                <Box className={classes.staffContainer}>
                    <Assistance />
                </Box>
            );
        } else {
            return(
                <Box className={classes.staffContainer}>
                    <h1> Menu should be here</h1>
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
            console.log(ret);
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
            console.log(ret);
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
                    <MenuList >
                        <MenuItem onClick={() => { this.setState({ currPage: "Menu" }) }}>Menu</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Orders" }) }}>Orders
                        <ListItemIcon>
                                <PriorityHighIcon fontSize="small" />
                            </ListItemIcon>
                        </MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Assistance" }) }}>Tables
                        <ListItemIcon>
                                <PriorityHighIcon fontSize="small" />
                            </ListItemIcon>
                        </MenuItem>
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