import React from 'react';
import { createStyles, WithStyles, Theme, withStyles, Button, Box, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper } from '@material-ui/core';

//mostly copied from https://codesandbox.io/s/v2eib &
//https://material-ui.com/components/tables/

const styles = (theme: Theme) =>
    createStyles({
        table: {
            minWidth: 500,
        },
        wrapper: {
            height: '100%',
            width: '100%',
            overflow: 'auto',
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
                <Table className={classes.table} aria-label="customized table">
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
                    <TableBody>
                        {rows.map(row => (
                            <StyledTableRow key={row.staffName}>
                                <StyledTableCell component="th" scope="row">
                                    {row.staffName}
                                </StyledTableCell>
                                <StyledTableCell >{row.staffUsername}</StyledTableCell>
                                <StyledTableCell >{row.staffType}</StyledTableCell>
                                <StyledTableCell >{row.lastOnline}</StyledTableCell>
                                <StyledTableCell >{row.changePassword}</StyledTableCell>
                                <StyledTableCell >{row.deleteU}</StyledTableCell>
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
            </div>
        );
    }
}

export default withStyles(styles)(StaffDetails);