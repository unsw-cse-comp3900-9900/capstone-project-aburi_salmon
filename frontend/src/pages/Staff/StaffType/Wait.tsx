import React from 'react';
import { createStyles,  withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, ListItemIcon, Box } from '@material-ui/core';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import ListContainer from './../../Staff/Orders/ListTemplateTable';
import Assistance from './../../Staff/Assistance/AssistanceMain';


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
    itemNum: number,
    listName: string,
}

class Wait extends React.Component<IProps, IState>{

    constructor(props: any){
        super(props);
        this.state = {
            currPage: "Orders",
            itemNum: -1,
            listName: "none",
        }
        this.updateCont = this.updateCont.bind(this);
    }

    displayCont(){
        const { classes } = this.props;
        if (this.state.currPage === "Orders") {
            return (
                <Box className={classes.staffContainer}>
                    <ListContainer name="To Be Served" update={this.updateCont}/>
                    <ListContainer name="Served" update={this.updateCont}/>
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

    displayNav(){
        return(
            <div className={this.props.classes.root}>
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

    updateCont(itemId: number, listName: string): void{
        console.log(itemId);
        console.log(listName);
        this.setState({itemNum: itemId, listName: listName});
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