import React from 'react';
import { createStyles, WithStyles, Theme, withStyles, Button, Box, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, TextField, FormControl, InputLabel, Select, Input } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

//mostly copied from https://codesandbox.io/s/v2eib &
//https://material-ui.com/components/tables/
//https://codesandbox.io/s/u0yv3
//https://material-ui.com/components/buttons/
//https://codesandbox.io/s/6r757
//https://material-ui.com/components/dialogs/

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
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        registBut: {
            float: "left"
        },
        tableBut: {
            float: "right",
        },
        wrapper1: {
            height: '92%',
            width: '100%',
            overflow: 'auto',
        },
        wrapper2:{
            height: '8%',
            width: '100%',
         
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


class StaffDetails extends React.Component<IProps, { deleteOpen:boolean, resetOpen: boolean, resetKeyOpen: boolean,tableOpen:boolean,resetStaff: string}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            deleteOpen: false,
            resetOpen: false,
            resetKeyOpen: false,
            tableOpen: false,
            resetStaff: "",
        }
    }

    
    deleteDialog(){
        return (
            <div>
                <Dialog
                    open={this.state.deleteOpen}
                    onClose={() => this.setState({deleteOpen: false})}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are You Sure?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this staff? There will be no reversing this process.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({deleteOpen: false})} color="primary">
                            Nevermind
                        </Button>
                        <Button onClick={() => this.setState({ deleteOpen: false })} color="primary" autoFocus>
                            Yes, I'm sure
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    changeTableDialog(){
        return (
            <div>
                <Dialog open={this.state.tableOpen} onClose={() => this.setState({ tableOpen: false })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change No. of Tables</DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        !Please be wary that changing the number of tables will refresh current orders. This is only intended for initial setup
                        before you start using the system.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="tableno"
                            label="Enter number"
                            fullWidth
                        />
                    </DialogContent>
                    
                    <DialogActions>
                        <Button onClick={() => this.setState({ tableOpen: false })} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.setState({ tableOpen: false })} color="primary">
                            Change
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    resetDialog() {
        return (
            <div>
                <Dialog open={this.state.resetOpen} onClose={() => this.setState({resetOpen: false})} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="pass"
                            label="New Password"
                            type="password"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="repass"
                            type="password"
                            label="Re-type Password"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({resetOpen: false})} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.setState({resetOpen: false})} color="primary">
                            Reset
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    resetKeyDialog() {
        return (
            <div>
                <Dialog open={this.state.resetKeyOpen} onClose={() => this.setState({ resetOpen: false })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change Registration Key</DialogTitle>
                    <DialogContent>
                        <form>
                        <FormControl className={this.props.classes.formControl}>
                            <InputLabel htmlFor="demo-dialog-native">Staff Type</InputLabel>
                            <Select
                                native
                                onChange = {(e) => console.log(e.target.value)}
                                input={<Input id="demo-dialog-native" />}>
                                <option aria-label="None" value="" />
                                <option value={"Manage"}>Manage</option>
                                <option value={"Wait"}>Wait</option>
                                <option value={"Kitchen"}>Kitchen</option>
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="pass"
                            label="New Key"
                            type="password"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="repass"
                            type="password"
                            label="Re-type New Key"
                            fullWidth
                        />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ resetKeyOpen: false })} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.setState({ resetKeyOpen: false })} color="primary">
                            Reset
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    printTable(){
        const { classes } = this.props;
        return (
            <TableContainer component={Paper}>
                {this.deleteDialog()}
                {this.resetDialog()}
                {this.resetKeyDialog()}
                {this.changeTableDialog()}
                <Table className={classes.table} aria-label="customized table"  size="small">
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
                                    <Button variant="contained" color="primary" onClick={() => this.setState({ resetOpen: true })}>
                                        Reset Password
                                    </Button>
                                </StyledTableCell>

                                <StyledTableCell padding={'none'} className={classes.rows}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        onClick={() => this.setState({deleteOpen: true})} 
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
                <div className={this.props.classes.wrapper1}>
                    {this.printTable()}
                    <br></br>
                </div>
                <div className={this.props.classes.wrapper2}>
                    <Button color="primary" className={this.props.classes.registBut} onClick={() => this.setState({ resetKeyOpen: true })}>Change Registration Key</Button>
                    <Button color="primary" className={this.props.classes.tableBut} onClick={() => this.setState({ tableOpen: true })}>Change No. of Tables</Button>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(StaffDetails);