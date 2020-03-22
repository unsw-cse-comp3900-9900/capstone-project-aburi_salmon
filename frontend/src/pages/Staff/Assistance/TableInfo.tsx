import React from 'react';
import { createStyles, WithStyles, Theme, withStyles, Button } from '@material-ui/core';


const styles = (theme: Theme) =>
    createStyles({
        line:{
            width: '100%',
        },
        wrapper: {
            width: '100%',
            paddingLeft: '2%',
            height: '95%',
            paddingRight: '2%',
            //border: '2px solid black',
            overflow: 'auto',
            //display: 'block',
        },
        text: {
            //float: 'left',
            //position: 'static',
        },
        paidBut: {
            //position: 'relative',
            float: 'right',
            //backgroundColor: 'lightgreen',
        },
        itemTable: {
            width: '100%',
            
        }

    });
export interface IProps extends WithStyles<typeof styles> {
    tableNumber: number
}

class TableInfo extends React.Component<IProps, {}>{
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                <h1 className = {classes.text}>Table {this.props.tableNumber}</h1>
                <hr className={classes.line}></hr>
              
                <table className={classes.itemTable}>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Cost (per item)</th>
                    </tr>
                    <tr>
                        <td>Burger</td>
                        <td>2</td>
                        <td>$15</td>
                    </tr>
                    <tr>
                        <td>Pizza</td>
                        <td>1</td>
                        <td>$20</td>
                    </tr>
                    <tr>
                        <td>Coffee</td>
                        <td>3</td>
                        <td>$4</td>
                    </tr>
                    <tr>
                        <td>Pasta</td>
                        <td>3</td>
                        <td>$22</td>
                    </tr>
                    <tr>
                        <td>Ice Cream</td>
                        <td>1</td>
                        <td>$10</td>
                    </tr>
                    <tr>
                        <td>Item name</td>
                        <td>Amount</td>
                        <td>$###</td>
                    </tr>
                </table>
                <hr className={classes.line}></hr>
                Total: #
                <Button color='primary' variant="contained" className={classes.paidBut}>paid</Button>
            </div>
        );
    }
}

export default withStyles(styles)(TableInfo);