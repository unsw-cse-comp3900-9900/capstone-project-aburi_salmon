import React from 'react';
import { withStyles, createStyles, AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import background from './../../assets/FoodBackground.jpg';
import history from './../../history';

const styles = (theme) =>
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
        }
    });


class PureStaffMain extends React.Component {

    logOut(){
        localStorage.setItem('username', null);
        localStorage.setItem('staff', 'false');
        history.push('/');
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Staff
                    </Typography>
                        <Button color="inherit" onClick = {() => this.logOut()}>Logout</Button>
                    </Toolbar>
                </AppBar>
                <br></br>
            </div>
        );
    }
}

export const StaffMain = withStyles(styles)(PureStaffMain);