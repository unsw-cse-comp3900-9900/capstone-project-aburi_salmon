import React from 'react';
import { createStyles, WithStyles, Theme, withStyles, Button, Box, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, TextField, FormControl, InputLabel, Select, Input } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { PropertyName } from 'lodash';
import {ItemList, ListItem} from './../../../api/models';
import {Client} from './../../../api/client';
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
        head: {
            position: 'sticky',
            top: '0px',
        },
        tableCont: {
            maxHeight: '95%',
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

interface IState {
    order: string,
    selected: string,
    realData: Array<ListItem>,
}

const statusArr = ['', 'Queue', 'Cooking', 'Ready', 'Served'];

class ManageOrders extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            order: 'asc',
            selected: 'status',
            realData: [],
        }
    }

    sortData2(dataType: string){
        var temp = this.state.realData;
        if (this.state.order === 'asc'){
            if (dataType === "orderId"){
                const sorted = temp.sort((a,b) => a.id < b.id ? 1:-1);
                this.setState({ realData: sorted });
            } else if (dataType === "tableNo") {
                const sorted = temp.sort((a, b) => 2 > 3 ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "itemName"){
                const sorted = temp.sort((a, b) => a.itemName < b.itemName ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "amount"){
                const sorted = temp.sort((a, b) => a.quantity < b.quantity ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "status"){
                const sorted = temp.sort((a, b) => a.status_id <b.status_id ? 1 : -1);
                this.setState({ realData: sorted });
            }
            this.setState({order: 'des'});
        } else {
            if (dataType === "orderId") {
                const sorted = temp.sort((a, b) => a.id > b.id ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "tableNo") {
                const sorted = temp.sort((a, b) => a.id > b.id ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "itemName") {
                const sorted = temp.sort((a, b) => a.itemName > b.itemName ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "amount") {
                const sorted = temp.sort((a, b) => a.quantity > b.quantity ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "status") {
                const sorted = temp.sort((a, b) => a.status_id > b.status_id ? 1 : -1);
                this.setState({ realData: sorted });
            }
            
            this.setState({order: 'asc'});
        }
    }

    async componentDidMount() {
        const client = new Client();
        const queue: ItemList | null = await client.getListItem(1);
        const cooking: ItemList | null = await client.getListItem(2);
        const ready: ItemList | null = await client.getListItem(3);
        const served: ItemList | null = await client.getListItem(4);
        var temp1: Array<ListItem> = [];
        if (queue?.itemList !== undefined){
            temp1 = temp1.concat(queue?.itemList);
        }
        if (cooking?.itemList !== undefined) {
            temp1 = temp1.concat(cooking?.itemList);
        }
        if (ready?.itemList !== undefined) {
            temp1 = temp1.concat(ready?.itemList);
        }
        if (served?.itemList !== undefined) {
            temp1 = temp1.concat(served?.itemList);
        }
        console.log(temp1);
        this.setState({
            realData: temp1,
        });
        
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
        this.sortData2(selected);
        this.setState({selected: selected })
    }

    printOrders2() {
    const { classes } = this.props;
        return (
            <TableContainer component={Paper} className={classes.tableCont}>
                <Table stickyHeader={true} className={classes.table} aria-label="customized table" size='small' >
                    <TableHead >
                        <TableRow>
                            <StyledTableCell className={classes.head} onClick={() => this.handleClick("orderId")}>Order ID {this.printArrow("orderId")}</StyledTableCell>
                            <StyledTableCell className={classes.head} onClick={() => this.handleClick("tableNo")}>Table Number {this.printArrow("tableNo")}</StyledTableCell>
                            <StyledTableCell className={classes.head} onClick={() => this.handleClick("itemName")}>Item Name {this.printArrow("itemName")}</StyledTableCell>
                            <StyledTableCell className={classes.head} onClick={() => this.handleClick("amount")}>Amount {this.printArrow("amount")}</StyledTableCell>
                            <StyledTableCell className={classes.head} onClick={() => this.handleClick("status")}>Status {this.printArrow("status")}</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {this.state.realData.map(item => (
                            <StyledTableRow key={item.id}>
                                <StyledTableCell component="th" scope="row">{item.id}</StyledTableCell>
                                <StyledTableCell>2</StyledTableCell>
                                <StyledTableCell>{item.itemName}</StyledTableCell>
                                <StyledTableCell>{item.quantity}</StyledTableCell>
                                <StyledTableCell>{statusArr[item.status_id]}</StyledTableCell>
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
                {this.printOrders2()}
                <br></br>
            </div>
        );
    }
}

export default withStyles(styles)(ManageOrders);