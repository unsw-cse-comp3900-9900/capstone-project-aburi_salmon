import React from 'react';
import { createStyles, WithStyles, Theme, withStyles, Button, Box, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
//mostly copied from https://codesandbox.io/s/v2eib &
//https://material-ui.com/components/tables/
//https://codesandbox.io/s/u0yv3
//https://material-ui.com/components/buttons/

const styles = (theme: Theme) =>
    createStyles({
        table: {
            minWidth: 550,
        },
        wrapper: {
            height: '100%',
            width: '100%',
            overflow: 'auto',
        },
        button: {
            margin: theme.spacing(1),
        },
        rows: {
            paddingLeft: theme.spacing(2),
        }
    });
export interface IProps extends WithStyles<typeof styles> {
}
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

function tempData(staffName: string, staffUsername: string, staffType: string, lastOnline: string, changePassword: string, deleteU: string){
    return {staffName, staffUsername, staffType, lastOnline, changePassword, deleteU} ; 
}

const rows = [
    tempData('Yennefer', 'admin', 'manager','now','<button>','<button>'),
    tempData('Cirilla', 'yemi', 'wait', 'Sometime', '<button>','<button>'),
    tempData('Geralt', 'james', 'kitchen', 'yesterday', '<button>','<button>'),
    tempData('Triss', 'polly', 'wait', 'tomorrow', '<button>', '<button>'),
    tempData('Jaskier', 'tom', 'wait', '21/3', '<button>', '<button>'),
    tempData('Calanthe', 'queen', 'kitchen', '8/12', '<button>', '<button>'),
];


class StaffDetails extends React.Component<IProps, {}>{
    printTable(){
        const { classes } = this.props;
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table" >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Staff Name</StyledTableCell>
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell>Staff Type</StyledTableCell>
                            <StyledTableCell>Last Online</StyledTableCell>
                            <StyledTableCell>Change Password</StyledTableCell>
                            <StyledTableCell>Delete User</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {rows.map(row => (
                            <StyledTableRow key={row.staffName}>
                                <StyledTableCell component="th" scope="row" padding={'none'} className={classes.rows}>
                                    {row.staffName}
                                </StyledTableCell>
                                <StyledTableCell padding={'none'} className={classes.rows}>{row.staffUsername}</StyledTableCell>
                                <StyledTableCell padding={'none'} className={classes.rows}>{row.staffType}</StyledTableCell>
                                <StyledTableCell padding={'none'} className={classes.rows}>{row.lastOnline}</StyledTableCell>
                                <StyledTableCell padding={'none'} className={classes.rows}>
                                    <Button variant="contained" color="primary">
                                        Reset Password
                                    </Button>
                                </StyledTableCell>

                                <StyledTableCell padding={'none'} className={classes.rows}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        startIcon={<DeleteIcon />}>
                                        Delete
                                    </Button>
                                    
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    render() {
        return (
            <div className={this.props.classes.wrapper}>
                {this.printTable()}
                <br></br>
                <Button color="primary">Change Registration Key</Button>
            </div>
        );
    }
}

export default withStyles(styles)(StaffDetails);