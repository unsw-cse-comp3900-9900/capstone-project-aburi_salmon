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
            display: 'block',
        },
        text: {
            float: 'left',
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


interface Item
{
    name: string,
    amount: number,
    cost: number,
}


class TableInfo extends React.Component<IProps, {items: Item[], total: number, hide: string}>{

    constructor(props: IProps){
        super(props);
        //Replace below with fetch backend function
        //---------------------------------------
        const item1: Item = {
            name: 'Burger',
            amount: 2,
            cost: 15,
        };
        const item2: Item = {
            name: 'Pizza',
            amount: 1,
            cost: 20,
        };
        const item3: Item = {
            name: 'Coffee',
            amount: 3,
            cost: 4,
        };
        const item4: Item = {
            name: 'Pasta',
            amount: 3,
            cost: 22,
        };
        const item5: Item = {
            name: 'Ice Cream',
            amount: 1,
            cost: 10,
        };
        var newArray = [];
        newArray.push(item1);
        newArray.push(item2);
        newArray.push(item3);
        newArray.push(item4);
        newArray.push(item5);
        this.state = {
            items: newArray,
            total: 1000.20,
            hide: 'none',
        };
        //------------------------------------------------
    }

    printItems(){
        let children = [];
        let ret = [];
        for (let j = 0; j < this.state.items.length; j++) {
            children.push(
                <tr>
                    <td>{this.state.items[j].name}</td>
                    <td>{this.state.items[j].amount}</td>
                    <td>{this.state.items[j].cost}</td>
                </tr>
            )
        };
        ret.push(
            <table className={this.props.classes.itemTable}>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Cost (per item)</th>
                </tr>
                {children}
                <tr>
        <td>Item name: {this.state.items.length}</td>
                    <td>Amount</td>
                    <td>$###</td>
                </tr>
            </table>
        );
        return ret;
    }


    render() {
        const { classes } = this.props;
        //this.grabTableInfo();
        return (
            <div className={classes.wrapper}>
                <h1 className = {classes.text}>Table {this.props.tableNumber}</h1>
                <Button color='secondary' variant="contained" className={classes.paidBut} 
              
                                >Resolved</Button>
                <hr className={classes.line}></hr>
              
                {this.printItems()}
                <hr className={classes.line}></hr>
                <br></br>
                Total: ${this.state.total}
                <Button color='primary' variant="contained" className={classes.paidBut}
                >paid</Button>
            
            </div>
        );
    }
}

export default withStyles(styles)(TableInfo);