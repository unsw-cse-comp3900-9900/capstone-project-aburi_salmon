import React from 'react';
import { WithStyles,withStyles, Button, Snackbar,TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {Client} from './../../../../api/client';
import { AllStaff, StaffInfo} from './../../../../api/models';
import { Alert } from '@material-ui/lab';
import DeleteDialog from './Components/DeleteDialog';
import ChangeStaffType from './Components/ChangeStaffType';
import ChangeTableNo from './Components/ChangeTableNo';
import ResetRegist from './Components/ResetRegist';
import {styles} from './styles';
//mostly copied from https://codesandbox.io/s/v2eib &
//https://material-ui.com/components/tables/
//https://codesandbox.io/s/u0yv3
//https://material-ui.com/components/buttons/
//https://codesandbox.io/s/6r757
//https://material-ui.com/components/dialogs/


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

export interface IProps extends WithStyles<typeof styles> {
    realData: AllStaff | null,
    update: any,
}

interface IState {
    deleteOpen:boolean,
    resetOpen: boolean,
    resetKeyOpen: boolean,
    tableOpen:boolean,
    resetStaff: string,
    selectedStaff: StaffInfo,
    isOpen: boolean,
    alertMessage: string,
    selectedStaffType: number,
    severity: 'success' | 'error'
}

class StaffDetails extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        var temp: StaffInfo ={
            id:-1,
            name:'',
            username:'',
            staff_type:'',
        }
        this.state = {
            deleteOpen: false,
            resetOpen: false,
            resetKeyOpen: false,
            tableOpen: false,
            resetStaff: "",
            selectedStaff: temp,
            isOpen: false,
            alertMessage: 'False Alarm',
            selectedStaffType: 1,
            severity: 'error',
        }
        this.deleteIsOpen = this.deleteIsOpen.bind(this);
        this.resetIsOpen = this.resetIsOpen.bind(this);
        this.tableNoIsOpen = this.tableNoIsOpen.bind(this);
        this.resetKeyOpen = this.resetKeyOpen.bind(this);
        this.deleteStaff = this.deleteStaff.bind(this);
        this.changeStaffType = this.changeStaffType.bind(this);
    }

    deleteIsOpen(isOpen: boolean){
        this.setState({deleteOpen: isOpen});
    }
    resetIsOpen(isOpen: boolean) {
        this.setState({ resetOpen: isOpen });
    }

    tableNoIsOpen(isOpen: boolean){
        this.setState({tableOpen: isOpen});
    }

    resetKeyOpen(isOpen: boolean){
        this.setState({resetKeyOpen: isOpen});
    }

    async changeStaffType(staffType: number){
        this.setState({ resetOpen: false });
        const client = new Client();
        const r: number | null = await client.changeStaffType(this.state.selectedStaff.id, this.state.selectedStaff.name, this.state.selectedStaff.username, staffType);
        console.log(r);
        if (r !== 200) {
            this.setState({ isOpen: true, alertMessage: "Something went wrong", severity: 'error' });
        } else {
            this.setState({ isOpen: true, alertMessage: 'Staff Successfully Changed', severity: 'success' });
            this.props.update();
        }
    }

    showAlert() {
        return (
            <Snackbar
                open={this.state.isOpen}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={this.state.severity}
                    action={
                        <Button color="inherit" size="small" onClick={() => this.setState({ isOpen: false })}>
                            OK
                            </Button>
                    }
                >{this.state.alertMessage}</Alert>
            </Snackbar>
        );
    }

    async deleteStaff(){
        this.setState({ deleteOpen: false });
        const client = new Client();
        const r: number | null = await client.deleteStaff(this.state.selectedStaff.id);
        console.log(r);
        if (r !== 200) {
            this.setState({ isOpen: true, alertMessage: 'Something went wrong', severity: 'error' });
        } else {
            this.setState({ isOpen: true, alertMessage: 'Staff Successfully Deleted', severity: 'success' });
            this.props.update();
        }
    }

    printTable() {
        const { classes } = this.props;
        return (
            <TableContainer component={Paper} className={classes.tableCont}>
                <DeleteDialog isOpen={this.state.deleteOpen} setIsOpen={this.deleteIsOpen} deleteStaff={this.deleteStaff} />
                <ChangeStaffType isOpen={this.state.resetOpen} setIsOpen={this.resetIsOpen} changeStaffType={this.changeStaffType} username={this.state.selectedStaff.username}/>
                {/*<ChangeTableNo isOpen={this.state.tableOpen} setIsOpen={this.tableNoIsOpen} />*/}
                <ResetRegist isOpen={this.state.resetKeyOpen} setIsOpen={this.resetKeyOpen} />
                <Table className={classes.table} aria-label="customized table" size="small" stickyHeader={true}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Staff ID</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell>Staff Type</StyledTableCell>
                            <StyledTableCell>Change Staff Type</StyledTableCell>
                            <StyledTableCell>Delete User</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {this.props.realData?.staff_list.map(staff => (
                            <StyledTableRow key={staff.id}>
                                <StyledTableCell component="th" scope="row" padding={'none'} className={classes.rows}>
                                    {staff.id}
                                </StyledTableCell>
                                <StyledTableCell padding={'none'} className={classes.rows}>{staff.name}</StyledTableCell>
                                <StyledTableCell padding={'none'} className={classes.rows}>{staff.username}</StyledTableCell>
                                <StyledTableCell padding={'none'} className={classes.rows}>{staff.staff_type}</StyledTableCell>
                                <StyledTableCell padding={'none'} className={classes.rows}>
                                    <Button variant="contained" color="primary" onClick={() => this.setState({ resetOpen: true, selectedStaff: staff })}>
                                        Change
                                    </Button>
                                </StyledTableCell>

                                <StyledTableCell padding={'none'} className={classes.rows}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        onClick={() => this.setState({ deleteOpen: true, selectedStaff:staff })}
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
                {this.showAlert()}
                <div className={this.props.classes.wrapper1}>
                    {this.printTable()}
                    <br></br>
                </div>
                <div className={this.props.classes.wrapper2}>
                    <Button color="primary" className={this.props.classes.registBut} onClick={() => this.setState({ resetKeyOpen: true })}>Change Registration Key</Button>
        {/*<Button color="primary" className={this.props.classes.tableBut} onClick={() => this.setState({ tableOpen: true })}>Change No. of Tables</Button>*/}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(StaffDetails);