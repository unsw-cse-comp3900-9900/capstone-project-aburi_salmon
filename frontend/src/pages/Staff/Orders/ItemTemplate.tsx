import React from 'react';
import { createStyles, WithStyles, Theme, withStyles } from '@material-ui/core';


//Props is what is passed in {declare in interface}
//state is what you store {decalre in react component}

const styles = (theme: Theme) =>
    createStyles({
        itemContainer: {
            //backgroundColor: 'lightblue',
            border: '1px solid grey',
            position: 'static',
            borderRadius: '10px',
            width: '94%',
            flexGrow: 1,
            marginLeft: '3%',
            marginRight: '3%',
            //height: '50px',
            height: 'auto',
            marginTop: '10px',
            overflow: 'hidden',
            padding: '4px 0px 4px 0px',
            //background: 'radial-gradient(circle, rgba(255, 253, 238, 1) 0%, rgba(233, 233, 209, 1) 100%)',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(200, 231, 250, 1) 100%)',
            boxShadow: "0px 6px 8px 0 rgba(0, 0, 0, 0.2)",
        }
    });
export interface IProps extends WithStyles<typeof styles> {
    listName: string,
    itemName: string,
    amount: number,
    table: number,
    time: string,
    update: any,
    //updateTable: () => void
}

class ItemCont extends React.Component<IProps, {}>{

    render() {
        const { classes } = this.props;
        return (
            <button className={classes.itemContainer} onClick={() => this.props.update(this.props.amount, this.props.listName)}>
                <b>Item Name:</b> {this.props.itemName} <br></br>
                <b>Amount:</b> {this.props.amount} <br></br>
                <b>Table:</b> {this.props.table} <br></br>
                <b>Time:</b> {this.props.time}
            </button>
        );
    }
}

export default withStyles(styles)(ItemCont);