import React from 'react';
import { createStyles, withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, ListItemIcon, Box } from '@material-ui/core';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import Queue from './../../Staff/Orders/QueueList';
import Cooking from './../../Staff/Orders/CookingList';
import Ready from './../../Staff/Orders/ReadyList';
import {ListItem} from './../../../api/models';

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
    itemNum: number,
    listName: string,
}

class Kitchen extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props);
        this.state = {
            currPage: "Orders",
            itemNum: -1,
            listName: "none",
        }
        this.updateCont = this.updateCont.bind(this);
    }

    displayCont() {
        const { classes } = this.props;
        if (this.state.currPage === "Orders") {
            return (
                <Box className={classes.staffContainer}>
                    <Queue update={this.updateCont} />
                    <Cooking update={this.updateCont} />
                    <Ready update={this.updateCont} />
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

    moveToCooking(item:ListItem, temp: string):void{

    }


    updateCont(itemId: number, listName: string): void {
        console.log(itemId)
        console.log(listName)

        this.setState({ itemNum: itemId, listName: listName });
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