import React from 'react';
import { createStyles, withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, Box} from '@material-ui/core';
import { ItemList } from './../../../api/models';
import { Client } from './../../../api/client';
import Assistance from './../../Staff/Assistance/AssistanceMain';
import StaffDetails from './../StaffDetails/StaffDetails';
//import Analytics from './../Analytics/Analytics';
import ManageOrders from './../Orders/ManageOrders';
import Feedback from './../Analytics/Feedback';
import ItemStats from './../Analytics/ItemStats';
import {EditMenu} from './../Menu/EditMenu';

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
            width: '100%',
            
            minWidth: '800px',
        },

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
            currPage: "Menu",
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
    }

    displayCont() {
        const { classes } = this.props;
        if (this.state.currPage === "Orders"){
            return (
                <Box className={classes.staffContainer}>
                    <ManageOrders />
                </Box>
            );
        } else if (this.state.currPage === "Tables") {
            return (
                <Box className={classes.staffContainer}>
                    <Assistance />
                </Box>
            );
        } else if (this.state.currPage === "Manage"){
            return(
                <Box className={classes.staffContainer}>
                    <StaffDetails />
                </Box>
            );
        } else if (this.state.currPage === "ItemStats") {
            return (
                <Box className={classes.staffContainer}>
                    <ItemStats />
                </Box>
            );
        } 
        else {
            return (
                <Box className={classes.menuContainer}>
                    <EditMenu />
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
                        <MenuItem onClick={() => { this.setState({ currPage: "Manage" }) }}>Manage</MenuItem>
        {/*<MenuItem onClick={() => { this.setState({ currPage: "Earnings" }) }}>Earnings</MenuItem>*/}
                        
                        <MenuItem onClick={() => { this.setState({ currPage: "ItemStats" }) }}>Item Statistics</MenuItem>
        {/* <MenuItem onClick={() => { this.setState({ currPage: "Feedback" }) }}>Feedback</MenuItem>*/}
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

export const ManageStaff = withStyles(styles)(Manage);