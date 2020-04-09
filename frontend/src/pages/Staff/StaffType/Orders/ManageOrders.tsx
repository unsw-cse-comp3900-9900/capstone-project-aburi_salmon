import React from 'react';
import { createStyles, WithStyles, Theme, withStyles, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper} from '@material-ui/core';
import {ItemList, ListItem} from './../../../../api/models';
import {Client} from './../../../../api/client';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

//sorting mostly copied from 
//https://stackoverflow.com/questions/40541710/reactjs-with-material-ui-how-to-sort-an-array-of-material-uis-tablerow-alpha


const styles = (theme: Theme) =>
    createStyles({
        table: {
            minWidth: 550,
            tableLayout: 'fixed',
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
        },
        icon: {
            display: 'flex',
            alignItems: 'center',
        },
       

    });
export interface IProps extends WithStyles<typeof styles> {
    realData: Array<ListItem>,
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
        var temp = this.props.realData;
        this.state = {
            order: 'des',
            selected: 'status',
            realData: temp,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    sortData(dataType: string){
        var temp = this.state.realData;
        if (this.state.order === 'asc'){
            if (dataType === "orderId"){
                const sorted = temp.sort((a,b) => a.id < b.id ? 1:-1);
                this.setState({ realData: sorted });
            } else if (dataType === "tableNo") {
                const sorted = temp.sort((a, b) => a.table > b.table ? 1 : -1);
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
                const sorted = temp.sort((a, b) => a.table > b.table ? 1 : -1);
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
        this.setState({
            realData: temp1,
        });
    }

    printArrow(dataType: string){
        if (dataType === this.state.selected){
            if (this.state.order === 'asc') {
                return <ExpandLessIcon />
            } else {
                return <ExpandMoreIcon />
            }
        }
    }

    handleClick(selected: string){
        this.sortData(selected);
        this.setState({selected: selected })
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
                        {this.state.realData.map(item => (
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