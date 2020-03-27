import React from 'react';
import { createStyles, withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, Box, Menu } from '@material-ui/core';
import { ListItem } from './../../../api/models';
import { ItemList } from './../../../api/models';
import { Client } from './../../../api/client';
import Queue from './../../Staff/Orders/QueueList';
import Cooking from './../../Staff/Orders/CookingList';
import Ready from './../../Staff/Orders/ReadyList';
import Assistance from './../../Staff/Assistance/AssistanceMain';
import StaffDetails from './../StaffDetails/StaffDetails';
import Analytics from './../Analytics/Analytics';


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
        minsize: {
            width: theme.spacing(17),
            
        }

    });
export interface IProps extends WithStyles<typeof styles> { }

interface IState {
    currPage: string,
    queueList: ItemList | null,
    cookingList: ItemList | null,
    readyList: ItemList | null,
}

class Manage extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props);
        this.state = {
            currPage: "Staff",
            queueList: null, //listType === 1
            cookingList: null, //listType === 2
            readyList: null, //listType === 3
        }
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
        if (this.state.currPage === "Orders"){
            return (
                <Box className={classes.staffContainer}>
                    <Queue update={this.emptyFunction} someList={this.state.queueList} />
                    <Cooking update={this.emptyFunction} someList={this.state.cookingList} />
                    <Ready update={this.emptyFunction} someList={this.state.readyList} />
                </Box>
            );
        } else if (this.state.currPage === "Tables") {
            return (
                <Box className={classes.staffContainer}>
                    <Assistance />
                </Box>
            );
        } else if (this.state.currPage === "Staff"){
            return(
                <Box className={classes.staffContainer}>
                    <StaffDetails />
                </Box>
            );
        } else if (this.state.currPage === "Analytics") {
            return(
                <Box className={classes.staffContainer}>
                    <Analytics />
                </Box>
            );
        }
        else {
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
                    <MenuList className={this.props.classes.minsize}>
                        <MenuItem onClick={() => { this.setState({ currPage: "Menu" }) }}>Menu</MenuItem>
                        <MenuItem onClick={() => {this.setState({ currPage: "Orders"})}}>Orders</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Tables" }) }}>Tables</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Staff" }) }}>Staff</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Analytics" }) }}>Analytics</MenuItem>
                    </MenuList>
                </Paper>
            </div>
        );
    }

    emptyFunction(itemId: number, item: ListItem): void{
        //does nothing
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

export const ManageStaff = withStyles(styles)(Manage);