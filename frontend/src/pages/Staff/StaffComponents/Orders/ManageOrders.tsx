import React from 'react';
import { WithStyles, withStyles, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper} from '@material-ui/core';
import {ItemList, ListItem} from './../../../../api/models';
import {Client} from './../../../../api/client';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {styles} from './styles';

//sorting mostly copied from 
//https://stackoverflow.com/questions/40541710/reactjs-with-material-ui-how-to-sort-an-array-of-material-uis-tablerow-alpha


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
    realData: Array<ListItem>,
    changeRealdata: any,
    order: string,
    selected: string,
    changeSelected: any,
    changeOrder: any,
}

interface IState {
    
}

const statusArr = ['', 'Queue', 'Cooking', 'Ready', 'Served'];

class ManageOrders extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    sortData(dataType: string){
        var temp = this.props.realData;
        var sorted = temp;
        if (this.props.order === 'asc'){
            if (dataType === "orderId"){
                sorted = temp.sort((a,b) => a.id < b.id ? 1:-1);
            } else if (dataType === "tableNo") {
                sorted = temp.sort((a, b) => a.table > b.table ? 1 : -1);
            } else if (dataType === "itemName"){
                sorted = temp.sort((a, b) => a.itemName < b.itemName ? 1 : -1);
            } else if (dataType === "amount"){
                sorted = temp.sort((a, b) => a.quantity < b.quantity ? 1 : -1);
            } else {
                sorted = temp.sort((a, b) => a.status_id <b.status_id ? 1 : -1);
            }
            this.props.changeRealdata(sorted);
            this.props.changeOrder('des');
        } else {
            if (dataType === "orderId") {
                sorted = temp.sort((a, b) => a.id > b.id ? 1 : -1);
            } else if (dataType === "tableNo") {
                sorted = temp.sort((a, b) => a.table > b.table ? 1 : -1);
            } else if (dataType === "itemName") {
                sorted = temp.sort((a, b) => a.itemName > b.itemName ? 1 : -1);
            } else if (dataType === "amount") {
                sorted = temp.sort((a, b) => a.quantity > b.quantity ? 1 : -1);
            } else {
                sorted = temp.sort((a, b) => a.status_id > b.status_id ? 1 : -1);
            }
            this.props.changeRealdata(sorted);
            this.props.changeOrder('asc');

        }
    }

    async refresh() {
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
        this.props.changeRealdata(temp1);
    }

    printArrow(dataType: string){
        if (dataType === this.props.selected){
            if (this.props.order === 'asc') {
                return <ExpandLessIcon />
            } else {
                return <ExpandMoreIcon />
            }
        }
    }

    handleClick(selected: string){
        this.sortData(selected);
        this.props.changeSelected(selected);
    }

    printOrders() {
    const { classes } = this.props;
        return (
            <TableContainer component={Paper} className={classes.tableCont}>
                <Table stickyHeader={true} className={classes.table} aria-label="customized table" size='small' >
                    <TableHead >
                        <TableRow>
                            <StyledTableCell className={classes.head} onClick={() => this.handleClick("orderId")}> <div className={classes.icon}>Order ID {this.printArrow("orderId")}</div></StyledTableCell>
                            <StyledTableCell className={classes.head} onClick={() => this.handleClick("tableNo")}> <div className={classes.icon}>Table Number {this.printArrow("tableNo")}</div></StyledTableCell>
                        <StyledTableCell className={classes.head} onClick={() => this.handleClick("itemName")}><div className={classes.icon}>Item Name {this.printArrow("itemName")}</div></StyledTableCell>
                            <StyledTableCell className={classes.head} onClick={() => this.handleClick("amount")}><div className={classes.icon}>Amount {this.printArrow("amount")}</div></StyledTableCell>
                            <StyledTableCell className={classes.head} onClick={() => this.handleClick("status")}><div className={classes.icon}>Status {this.printArrow("status")}</div></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {this.props.realData.map(item => (
                            <StyledTableRow key={item.id}>
                                <StyledTableCell component="th" scope="row">{item.id}</StyledTableCell>
                                <StyledTableCell>{item.table + 1}</StyledTableCell>
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
                {this.printOrders()}
                <br></br>
            </div>
        );
    }
}

export default withStyles(styles)(ManageOrders);