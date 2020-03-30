import React from 'react';
import { createStyles, WithStyles, Theme, withStyles, Button, Box, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, TextField, FormControl, InputLabel, Select, Input } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { PropertyName } from 'lodash';
//mostly copied from 
//https://stackoverflow.com/questions/40541710/reactjs-with-material-ui-how-to-sort-an-array-of-material-uis-tablerow-alpha


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

function tempData(orderId: number, tableNo: number, itemName: string, amount: number, status: string){
    return {orderId, tableNo, itemName, amount, status} ; 
}

const rows = [
    tempData(1, 3, 'Aburi Salmon',2,'Ready'),
    tempData(2, 6, 'Cheese Pizza', 2, 'Served'),
    tempData(3, 5, 'Pasta', 3, 'Cooking'),
    tempData(4, 7, 'Vege Burger', 1, 'In Queue'),
    tempData(5, 1, 'Chips', 2, 'Served'),
    tempData(6, 2, 'Salad', 10, 'Cooking'),
];


class ManageOrders extends React.Component<IProps, {data: Array<any>, order: string, selected: string}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            data: rows,
            order: 'asc',
            selected: 'orderId',
        }
    }


    sortData(dataType: string){
        console.log('hey');
        var temp = rows;
        if (this.state.order === 'asc'){
            if (dataType === "orderId"){
                const sorted = temp.sort((a,b) => a["orderId"] < b["orderId"] ? 1:-1);
                this.setState({ data: sorted });
            } else if (dataType === "tableNo") {
                const sorted = temp.sort((a, b) => a["tableNo"] < b["tableNo"] ? 1 : -1);
                this.setState({ data: sorted });
            } else if (dataType === "itemName"){
                const sorted = temp.sort((a, b) => a["itemName"] < b["itemName"] ? 1 : -1);
                this.setState({ data: sorted });
            } else if (dataType === "amount"){
                const sorted = temp.sort((a, b) => a["amount"] < b["amount"] ? 1 : -1);
                this.setState({ data: sorted });
            } else if (dataType === "status"){
                const sorted = temp.sort((a, b) => a["status"] < b["status"] ? 1 : -1);
                this.setState({ data: sorted });
            }
            this.setState({order: 'des'});
        } else {
            if (dataType === "orderId") {
                const sorted = temp.sort((a, b) => a["orderId"] > b["orderId"] ? 1 : -1);
                this.setState({ data: sorted });
            } else if (dataType === "tableNo") {
                const sorted = temp.sort((a, b) => a["tableNo"] > b["tableNo"] ? 1 : -1);
                this.setState({ data: sorted });
            } else if (dataType === "itemName") {
                const sorted = temp.sort((a, b) => a["itemName"] > b["itemName"] ? 1 : -1);
                this.setState({ data: sorted });
            } else if (dataType === "amount") {
                const sorted = temp.sort((a, b) => a["amount"] > b["amount"] ? 1 : -1);
                this.setState({ data: sorted });
            } else if (dataType === "status"){
                const sorted = temp.sort((a, b) => a["status"] > b["status"] ? 1 : -1);
                this.setState({ data: sorted });
            };
            
            this.setState({order: 'asc'});
        }
    }

    printArrow(dataType: string){
        if (dataType === this.state.selected){
            if (this.state.order === 'asc') {
                return " [+]"
            } else {
                return " [-]"
            }
        }
    }

    handleClick(selected: string){
        this.sortData(selected);
        this.setState({selected: selected })
    }

    printOrders(){
        const { classes } = this.props;
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table" >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell onClick={() => this.handleClick("orderId")}>Order ID {this.printArrow("orderId")}</StyledTableCell>
                            <StyledTableCell onClick={() => this.handleClick("tableNo")}>Table Number {this.printArrow("tableNo")}</StyledTableCell>
                            <StyledTableCell onClick={() => this.handleClick("itemName")}>Item Name {this.printArrow("itemName")}</StyledTableCell>
                            <StyledTableCell onClick={() => this.handleClick("amount")}>Amount {this.printArrow("amount")}</StyledTableCell>
                            <StyledTableCell onClick={() => this.handleClick("status")}>Status {this.printArrow("status")}</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {rows.map(row => (
                            <StyledTableRow key={row.orderId}>
                                <StyledTableCell component="th" scope="row">{row.orderId}</StyledTableCell>
                                <StyledTableCell>{row.tableNo}</StyledTableCell>
                                <StyledTableCell>{row.itemName}</StyledTableCell>
                                <StyledTableCell>{row.amount}</StyledTableCell>
                                <StyledTableCell>{row.status}</StyledTableCell>
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
                {this.printOrders()}
                <br></br>
               
            </div>
        );
    }
}

export default withStyles(styles)(ManageOrders);