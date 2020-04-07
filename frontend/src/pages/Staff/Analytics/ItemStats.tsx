import React from 'react';
import { createStyles, WithStyles, withStyles, Paper, Theme, TableContainer,  TableHead, TableRow, Table, TableBody, TableCell } from '@material-ui/core';
import {Client} from './../../../api/client';
import {AllItemStats, ItemStats} from './../../../api/models';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const styles = (theme: Theme) =>
    createStyles({
        table: {
            minWidth: 300,
            tableLayout: 'fixed',
        },
        wrapper: {
            height: '100%',
            width: '100%',
        },
        wrapper1: {
            height: '94%',
            width: '100%',
            overflow: 'auto',
        },
        wrapper2: {
            height: '5%',
            width: '100%',
        },
        icon: {
            display: 'flex',
            alignItems: 'center',
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

interface IState {
    order: string,
    selected: string,
    realData: Array<ItemStats>,
    trevenue: number,
}


class ItemStatsClass extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            realData: [],
            order: 'des',
            selected: 'itemId',
            trevenue: 0,
        }
    }

    async componentDidMount() {
        const client = new Client();
        const t: AllItemStats | null = await client.getAllStats();
        if (t?.item_sales !== undefined){
            this.setState({ realData: t?.item_sales});
        }
        if (t?.total_revenue !== undefined){
            this.setState({trevenue: t?.total_revenue})
        }
    }

    sortData(dataType: string) {
        var temp = this.state.realData;
        if (this.state.order === 'asc') {
            if (dataType === "itemId") {
                const sorted = temp.sort((a, b) => a.id < b.id ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "name") {
                const sorted = temp.sort((a, b) => a.name < b.name ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "sold") {
                const sorted = temp.sort((a, b) => a.orders < b.orders ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "price") {
                const sorted = temp.sort((a, b) => a.price < b.price ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "revenue") {
                const sorted = temp.sort((a, b) => a.revenue < b.revenue ? 1 : -1);
                this.setState({ realData: sorted });
            }
            this.setState({ order: 'des' });
        } else {
            if (dataType === "itemId") {
                const sorted = temp.sort((a, b) => a.id > b.id ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "name") {
                const sorted = temp.sort((a, b) => a.name > b.name ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "sold") {
                const sorted = temp.sort((a, b) => a.orders > b.orders ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "price") {
                const sorted = temp.sort((a, b) => a.price > b.price ? 1 : -1);
                this.setState({ realData: sorted });
            } else if (dataType === "revenue") {
                const sorted = temp.sort((a, b) => a.revenue > b.revenue ? 1 : -1);
                this.setState({ realData: sorted });
            }

            this.setState({ order: 'asc' });
        }
    }

    printArrow(dataType: string) {
        if (dataType === this.state.selected) {
            if (this.state.order === 'asc') {
                return <ExpandLessIcon />
            } else {
                return <ExpandMoreIcon />
            }
        }
    }

    handleClick(selected: string) { //sort data then re-renders
        this.sortData(selected);
        this.setState({ selected: selected });
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
                        {this.state.realData.map(item => (
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
                    <b>Total Revenue: ${this.state.trevenue.toFixed(2)}</b>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ItemStatsClass);