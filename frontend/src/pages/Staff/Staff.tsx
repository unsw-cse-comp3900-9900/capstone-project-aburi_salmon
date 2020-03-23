import React from 'react';
import { AppBar, Toolbar,  Typography, createStyles, Button, withStyles, WithStyles, Theme, MenuList, Paper, MenuItem, ListItemIcon, Box } from '@material-ui/core';
import background from './../../assets/FoodBackground.jpg';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import history from '../../history';
import ListContainer from './../Staff/Orders/ListTemplateTable';
import Assistance from './../Staff/Assistance/AssistanceMain';

//https://material-ui.com/components/menus/#menus
//https://stackoverflow.com/questions/58630490/how-to-convert-functional-componenet-to-class-component-in-react-in-material

const styles = (theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },      
        container: {
            display: 'flex',
            alignItems: 'flex-start',
            height: '85vh',
        },
        wrapper: {
            height: '97vh',
            width: '100%',
            backgroundImage: background,
        },
        menubutton: {
            marginRight: theme.spacing(1),
            paddingRight: '10px',
            //width: '100%',
            //height: '18vh',
        },
        root: {
            display: 'flex',
        },
        staffContainer: {
            backgroundColor: 'white',
            border: '2px solid darkblue',
            padding: theme.spacing(2),
            //position: 'static',    
            flexGrow: 1,
            display: 'flex',
            top: theme.spacing(2),
            left: theme.spacing(2),
            alignSelf: 'stretch',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(2),
            //bottom: theme.spacing(2),
            //alignItems: 'stretch',
        },
        appbar: {
            background: 'black',
        }

    });
export interface IProps extends WithStyles<typeof styles> { }

class StaffPage extends React.Component<IProps, {currPage: string, staffType: string, itemNum: number, listName: string}>{

    constructor(props: any){
        super(props);
        this.state = {
            currPage: "Assistance",
            staffType: "wait",
            itemNum: -1,
            listName: "none",
        }
        this.updateCont = this.updateCont.bind(this);
    }

    //function where if clicked, returns queue and itemid



    displayCont(){
        const { classes } = this.props;
        if (this.state.currPage === "Orders") {
            if (this.state.staffType === "wait"){
                return (
                    <Box className={classes.staffContainer}>
                        <ListContainer name="To Be Served" update={this.updateCont}/>
                        <ListContainer name="Served" update={this.updateCont}/>
                    </Box>
                );
            } else if (this.state.staffType === "kitchen"){
                return(
                    <Box className={classes.staffContainer}>
                        <ListContainer name="Queue" update={this.updateCont}/>
                        <ListContainer name="Cooking" update={this.updateCont}/>
                        <ListContainer name="Ready" update={this.updateCont}/>
                    </Box>
                );
            } else {
                return(
                    <h1>something went wrong...</h1>
                );
            }
            
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

    logOut() {
        localStorage.setItem('username', "");
        localStorage.setItem('staff', 'false');
        fetch("/auth/logout", {
            method: 'OPTIONS',
        }).then((msg) => {
            if (msg.status === 200) {
                alert('you have successfully logged out');
            } else {
                alert(msg.status);
            }
        }).catch((status) => {
            console.log(status);
        });
        history.push('/');
    }

    isStaff() {
        if (localStorage.getItem('staff') !== 'true') {
           // alert('You must log in to enter this page');
            //history.push('/');
        }
    }

    displayNav(){
        if (this.state.staffType === "wait"){
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
         
        } else if (this.state.staffType === "kitchen"){
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
        } else if (this.state.staffType === "manage"){
            return (
                <div className={this.props.classes.root}>
                    <Paper className={this.props.classes.menubutton}>
                        <MenuList >
                            <MenuItem onClick={() => { this.setState({ currPage: "Menu" }) }}>Menu</MenuItem>    
                        </MenuList>
                    </Paper>
                </div>
            );
        } else {
            //alert('You are not a valid staff');
            //history.push('/');
        }
    }

    updateCont(itemId: number, listName: string): void{
        console.log(itemId)
        console.log(listName)
        this.setState({itemNum: itemId, listName: listName});
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                {this.isStaff()}
                <AppBar position="static" className={classes.appbar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                        {/*Staff: {localStorage.getItem('username')}*/}
                        Stafftype: {this.state.staffType} List: {this.state.listName} and Amount: {this.state.itemNum}
                    </Typography>
                        <Button color="inherit" onClick={() => this.logOut()}>Logout</Button>
                        {/*<Button color="inherit">{this.state.listName}</Button>*/}
                    </Toolbar>
                </AppBar>
                <br></br>
                <div className={classes.container}>
                    {this.displayNav()}
                    {this.displayCont()}
                </div>

            </div>
        );
    }
}

export const Staff =  withStyles(styles)(StaffPage);
