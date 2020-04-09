import React from 'react';
import { AppBar, Toolbar,  Typography, Button, withStyles, WithStyles, MenuItem, Menu} from '@material-ui/core';
import history from '../../history';
import { KitchenStaff } from './../Staff/StaffType/Kitchen';
import { WaitStaff } from './../Staff/StaffType/Wait';
import { ManageStaff } from './../Staff/StaffType/Manage';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {styles} from './styles';


export interface IProps extends WithStyles<typeof styles> { }

interface IState{
    staffType: string
}

class StaffPage extends React.Component<IProps, IState>{

    constructor(props: any){
        super(props);
        this.state = {
            staffType: "Manage",
        };
    }

    logOut() {
        localStorage.setItem('username', "");
        localStorage.setItem('staff', 'false');
        fetch("http://localhost:5000/auth/logout", {
            method: 'POST',
            credentials: 'include',
            mode: 'cors'
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
            alert('You must log in to enter this page');
            history.push('/');
        }
    }

    displayStaff(){
        if (this.state.staffType === 'Wait'){
            return(
                <WaitStaff />
            );
        } else if(this.state.staffType === 'Kitchen'){
            return(
                <KitchenStaff />
            );

        } else if(this.state.staffType === 'Manage'){
            return(
                <ManageStaff />
            );
        } else {
            alert('You are not a valid staff');
            history.push('/');
        }
    }

    changeStaffType(popupState: any, staffType: string){
        this.setState({staffType: staffType});
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                {this.isStaff()}
                For Testing Purposes:
                <PopupState variant="popover" popupId="demo-popup-menu">
                    {popupState => (
                        <React.Fragment>
                            <Button variant="contained" color="primary" {...bindTrigger(popupState)}>
                                StaffType
                            </Button>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => this.changeStaffType(popupState, "Kitchen")}>Kitchen</MenuItem>
                                <MenuItem onClick={() => this.changeStaffType(popupState,"Wait")}>Wait</MenuItem>
                                <MenuItem onClick={() => this.changeStaffType(popupState,"Manage")}>Manage</MenuItem>
                            </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
                <AppBar position="static" className={classes.appbar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                        {localStorage.getItem('username')}: {this.state.staffType} staff
                    </Typography>
                        <Button color="inherit" onClick={() => this.logOut()}>Logout</Button>
                    </Toolbar>
                </AppBar>
                <br></br>
                {this.displayStaff()}
            </div>
        );
    }
}

export const Staff =  withStyles(styles)(StaffPage);
