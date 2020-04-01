import React from 'react';
import { createStyles, WithStyles, withStyles, Paper, Theme, TableContainer,  TableHead, TableRow, Button, Table, TableBody, TableCell } from '@material-ui/core';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import {Client} from './../../../api/client';
import {AllItemStats} from './../../../api/models';


//copied from https://codesandbox.io/s/2hp3y
//https://devexpress.github.io/devextreme-reactive/react/chart/demos/bar/simple-bar/
import { Animation } from '@devexpress/dx-react-chart';

const styles = (theme: Theme) =>
    createStyles({
        table: {
            minWidth: 300,
        },
        wrapper: {
            height: '100%',
            width: '100%',
        },
        profits: {
            height: '90%',
            width: '47%',
            margin: '1.5%',
            //border: '1px solid black',
            float: 'left',
        },
        itemTable: {
            height: '90%',
            width: '47%',
            margin: '1.5%',
            //border: '1px solid black',
            float: 'right',
        },
        wrapper1: {
            height: '94%',
            width: '100%',
            overflow: 'auto',
        },
        wrapper2: {
            height: '5%',
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



function createItemStats(itemname: string, category: string, cost: number, amount: number, profit: number){
    return {itemname, category, cost, amount, profit};
};

const dummyStats = [
    createItemStats('Aburi Salmon', 'Japanese', 11, 30, 330),
    createItemStats('Vegetable Tempura', 'Japanese', 8, 10, 80),
    createItemStats('Pasta', 'Italian', 22, 15, 330),
    createItemStats('Hot Chips', 'Western', 10, 2, 20),
    createItemStats('Fried Rice', 'Chinese', 11, 20, 220),
    createItemStats('Green Tea', 'Japanese', 100, 1, 100),
    createItemStats('Omelette', 'Japanese', 11, 21, 231),

];

class ItemStats extends React.Component<IProps, {realData: AllItemStats | null}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            realData: null,
        }
    }

    async componentDidMount() {
        const client = new Client();
        const t: AllItemStats | null = await client.getAllStats();
        this.setState({ realData: t });
        console.log(t);
    }


    printItemTable() {
        const { classes } = this.props;
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table" size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Item</StyledTableCell>
                            <StyledTableCell>Category</StyledTableCell>
                            <StyledTableCell>Cost ($)</StyledTableCell>
                            <StyledTableCell>Sold</StyledTableCell>
                            <StyledTableCell>Total Profit ($)</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {dummyStats.map(row => (
                            <StyledTableRow key={row.itemname}>
                                <StyledTableCell component="th" scope="row">
                                    {row.itemname}
                                </StyledTableCell>
                                <StyledTableCell>{row.category}</StyledTableCell>
                                <StyledTableCell>{row.cost}</StyledTableCell>
                                <StyledTableCell>{row.amount}</StyledTableCell>
                                <StyledTableCell>{row.profit}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    printItemTable2() {
        const { classes } = this.props;
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table" size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Item ID</StyledTableCell>
                            <StyledTableCell>name</StyledTableCell>
                            <StyledTableCell>Sold</StyledTableCell>
                            <StyledTableCell>Price ($)</StyledTableCell>
                            <StyledTableCell>Total Profit ($)</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {this.state.realData?.item_sales.map(item => (
                            <StyledTableRow key={item.id}>
                                <StyledTableCell component="th" scope="row">
                                    {item.id}
                                </StyledTableCell>
                                <StyledTableCell>{item.name}</StyledTableCell>
                                <StyledTableCell>{item.orders}</StyledTableCell>
                                <StyledTableCell>{item.price}</StyledTableCell>
                                <StyledTableCell>{item.revenue}</StyledTableCell>
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
                {this.printItemTable2()}
                </div>
                <div className={this.props.classes.wrapper2}>
                    Total Revenue: ${this.state.realData?.total_revenue}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ItemStats);