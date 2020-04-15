import React from 'react';
import { WithStyles, withStyles, Paper,TableContainer,  TableHead, TableRow, Table, TableBody, TableCell } from '@material-ui/core';
import { ItemStats} from './../../../../api/models';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {styles} from './styles';

//display a table containing information on item statistics

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
    realData: Array<ItemStats>,
    trevenue: number,
    setRealdata: any,
    order: string,
    selected: string,
    setOrder: any,
    setSelected: any,
}

class ItemStatsClass extends React.Component<IProps, {}>{

    //for sorting table if arrow is clicked
    sortData(dataType: string) {
        var temp = this.props.realData;
        var sorted = temp;
        if (this.props.order === 'asc') {
            if (dataType === "itemId") {
                sorted = temp.sort((a, b) => a.id < b.id ? 1 : -1);
            } else if (dataType === "name") {
                sorted = temp.sort((a, b) => a.name < b.name ? 1 : -1);
            } else if (dataType === "sold") {
                sorted = temp.sort((a, b) => a.orders < b.orders ? 1 : -1);
            } else if (dataType === "price") {
                sorted = temp.sort((a, b) => a.price < b.price ? 1 : -1);
            } else {
                sorted = temp.sort((a, b) => a.revenue < b.revenue ? 1 : -1);
            }
            this.props.setRealdata(sorted);
            this.props.setOrder('des');
        } else {
            if (dataType === "itemId") {
                sorted = temp.sort((a, b) => a.id > b.id ? 1 : -1);
            } else if (dataType === "name") {
                sorted = temp.sort((a, b) => a.name > b.name ? 1 : -1);
            } else if (dataType === "sold") {
                sorted = temp.sort((a, b) => a.orders > b.orders ? 1 : -1);
            } else if (dataType === "price") {
                sorted = temp.sort((a, b) => a.price > b.price ? 1 : -1);
            } else if (dataType === "revenue") {
                sorted = temp.sort((a, b) => a.revenue > b.revenue ? 1 : -1);
            }
            this.props.setRealdata(sorted);
            this.props.setOrder('asc');
        }
    }

    printArrow(dataType: string) {
        if (dataType === this.props.selected) {
            if (this.props.order === 'asc') {
                return <ExpandLessIcon />
            } else {
                return <ExpandMoreIcon />
            }
        }
    }

    handleClick(selected: string) { //sort data then re-renders
        this.sortData(selected);
        this.props.setSelected(selected);
    }

    printItemTable() {
        const { classes } = this.props;
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table" size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell onClick={() => this.handleClick("itemId")}><div className={classes.icon}>Item ID {this.printArrow("itemId")}</div></StyledTableCell>
                            <StyledTableCell onClick={() => this.handleClick("name")}> <div className={classes.icon}>Item Name{this.printArrow("name")}</div></StyledTableCell>
                            <StyledTableCell onClick={() => this.handleClick("sold")}><div className={classes.icon}>Sold {this.printArrow("sold")}</div></StyledTableCell>
                            <StyledTableCell onClick={() => this.handleClick("price")}><div className={classes.icon}>Price ($) {this.printArrow("price")}</div></StyledTableCell>
                            <StyledTableCell onClick={() => this.handleClick("revenue")}><div className={classes.icon}>Revenue ($) {this.printArrow("revenue")}</div></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {this.props.realData.map(item => (
                            <StyledTableRow key={item.id}>
                                <StyledTableCell component="th" scope="row">
                                    {item.id}
                                </StyledTableCell>
                                <StyledTableCell>{item.name}</StyledTableCell>
                                <StyledTableCell>{item.orders}</StyledTableCell>
                                <StyledTableCell>{item.price.toFixed(2)}</StyledTableCell>
                                <StyledTableCell>{item.revenue.toFixed(2)}</StyledTableCell>
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
                {this.printItemTable()}
                </div>
                <div className={this.props.classes.wrapper2}>
                    <b>Total Revenue: ${this.props.trevenue.toFixed(2)}</b>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ItemStatsClass);