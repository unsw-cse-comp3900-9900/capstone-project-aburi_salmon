import React from 'react';
import { createStyles, WithStyles, withStyles, Paper, Theme, TableContainer,  TableHead, TableRow, Button, Table, TableBody, TableCell } from '@material-ui/core';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';


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
            overflow: 'auto',
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


const data = [
    { year: '1950', population: 2.525 },
    { year: '1960', population: 3.018 },
    { year: '1970', population: 3.682 },
    { year: '1980', population: 4.440 },
    { year: '1990', population: 5.310 },
    { year: '2000', population: 6.127 },
    { year: '2010', population: 6.930 },
];

function tempData(staffName: string, staffUsername: string, staffType: string, lastOnline: string, changePassword: string, deleteU: string) {
    return { staffName, staffUsername, staffType, lastOnline, changePassword, deleteU };
}

const rows = [
    tempData('Yennefer', 'admin', 'manager', 'now', '<button>', '<button>'),
    tempData('Cirilla', 'yemi', 'wait', 'Sometime', '<button>', '<button>'),
    tempData('Geralt', 'james', 'kitchen', 'yesterday', '<button>', '<button>'),
    tempData('Triss', 'polly', 'wait', 'tomorrow', '<button>', '<button>'),
    tempData('Jaskier', 'tom', 'wait', '21/3', '<button>', '<button>'),
    tempData('Calanthe', 'queen', 'kitchen', '8/12', '<button>', '<button>'),
];

function createFeedback(feedback: string, stars: number){
    return {feedback, stars};
}

const dummyFeedback = [
    //createFeedback('This user interface is terrible', 2),
    createFeedback('I suggest you have a help button to show people how to use this system', 2),
    createFeedback('The food was good', 4),
    createFeedback('The pages are too white',3),
    createFeedback('Fast service', 4),
];

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

class Analytics extends React.Component<IProps, {data: any}>{

    constructor(props: IProps) {
        super(props);
        this.state = {
            data,
        };
    }
    getGraph(){
        const { data: chartData } = this.state;
        return (
            <Paper>
                <Chart
                    data={chartData}
                >
                    <ArgumentAxis />
                    <ValueAxis />

                    <BarSeries
                        valueField="population"
                        argumentField="year"
                    />
                    <Title text="Overall Profits (last 7 days)" />
                    <Animation />
                </Chart>
            </Paper>
        );
    }

    printItemTable() {
        const { classes } = this.props;
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table" >
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

    printFeedbackTable() {
        const { classes } = this.props;
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table" >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Feedback</StyledTableCell>
                            <StyledTableCell>Stars</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {dummyFeedback.map((row, index) => (
                            <StyledTableRow key={index}>
                                <StyledTableCell component="th" scope="row">
                                    {row.feedback}
                                </StyledTableCell>
                                <StyledTableCell>{row.stars}</StyledTableCell>
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
                <div className={this.props.classes.profits}>
                    {this.getGraph()}
                </div>
                <div className={this.props.classes.itemTable}>
                    {this.printItemTable()}
                </div>
                <br></br>
                {this.printFeedbackTable()}
            </div>
        );
    }
}

export default withStyles(styles)(Analytics);