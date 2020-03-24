import React from 'react';
import { AppBar, Toolbar,  Typography, createStyles, Button, withStyles, WithStyles, Theme} from '@material-ui/core';
import background from './../../assets/FoodBackground.jpg';
import history from '../../history';
import { KitchenStaff } from './../Staff/StaffType/Kitchen';
import { WaitStaff } from './../Staff/StaffType/Wait';
import { ManageStaff } from './../Staff/StaffType/Manage';

const styles = (theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },      
        wrapper: {
            height: '97vh',
            width: '100%',
            backgroundImage: background,
        },
        menubutton: {
            marginRight: theme.spacing(1),
            paddingRight: '10px',
        },
        root: {
            display: 'flex',
        },
        appbar: {
            background: 'black',
        }

    });
export interface IProps extends WithStyles<typeof styles> { }

interface IState{
    staffType: string
}

class StaffPage extends React.Component<IProps, IState>{

    constructor(props: any){
        super(props);
        this.state = {
            staffType: "kitchen",
        };
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
            alert('You must log in to enter this page');
            history.push('/');
        }
    }

    displayStaff(){
        if (this.state.staffType === 'wait'){
            return(
                <WaitStaff />
            );
        } else if(this.state.staffType === 'kitchen'){
            return(
                <KitchenStaff />
            );

        } else if(this.state.staffType === 'manage'){
            return(
                <ManageStaff />
            );
        } else {
            alert('You are not a valid staff');
            history.push('/');
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                {this.isStaff()}
                <AppBar position="static" className={classes.appbar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                        Staffname: {localStorage.getItem('username')} StaffType: {this.state.staffType}
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
