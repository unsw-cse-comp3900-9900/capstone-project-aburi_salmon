import React from 'react';
import { createStyles, WithStyles, withStyles, Paper, Theme, TableContainer,  TableHead, TableRow, Table, TableBody, TableCell } from '@material-ui/core';

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


function createFeedback(feedback: string, stars: number){
    return {feedback, stars};
}

const dummyFeedback = [
    createFeedback('I suggest you have a help button to show people how to use this system', 2),
    createFeedback('The food was good', 4),
    createFeedback('The pages are too white',3),
    createFeedback('Fast service', 4),
    createFeedback('Average Star Rating', 3.1)
];

class Feedback extends React.Component<IProps, {}>{

    printFeedbackTable() {
        const { classes } = this.props;
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table" size="small" >
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
                {this.printFeedbackTable()}
            </div>
        );
    }
}

export default withStyles(styles)(Feedback);