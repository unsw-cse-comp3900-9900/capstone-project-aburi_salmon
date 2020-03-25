import React from 'react';
import { createStyles, withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, Box, Menu } from '@material-ui/core';

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

class Manage extends React.Component<IProps, IState>{

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
        return (
            <Box className={classes.staffContainer}>
                <h1> Menu should be here</h1>
            </Box>
        );
        
    }

    displayNav() {
        return (
            <div className={this.props.classes.root}>
                <Paper className={this.props.classes.menubutton}>
                    <MenuList >
                        <MenuItem onClick={() => { this.setState({ currPage: "Menu" }) }}>Menu</MenuItem>
                        <MenuItem>Orders</MenuItem>
                        <MenuItem>Tables</MenuItem>
                        <MenuItem>Staff     </MenuItem>
                        <MenuItem>Analytics</MenuItem>
                    </MenuList>
                </Paper>
            </div>
        );
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

export const ManageStaff = withStyles(styles)(Manage);