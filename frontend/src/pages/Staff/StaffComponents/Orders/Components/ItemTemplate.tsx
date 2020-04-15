import React from 'react';
import { WithStyles, withStyles } from '@material-ui/core';
import {ListItem} from './../../../../../api/models';
import {styles} from './styles';
//Personal note:
//Props is what is passed in {declare in interface}
//state is what you store {decalre in react component}

//Renders each item in the item list for viewing orders
//Just a button container displaying information on item given by parent container

export interface IProps extends WithStyles<typeof styles> {
    item: ListItem,
    itemId: number,
    update: any,
    realId: number,
    lastClicked: number,
}

class ItemCont extends React.Component<IProps, {}>{

    displayComment(){
        if (this.props.item?.comment !== ''){
            return <div><b>Comment:</b> {this.props.item?.comment}</div>
        }
    }

    render() {
        const { classes } = this.props;
        if (this.props.realId === this.props.lastClicked){
            return(
                <button className={classes.currContainer} onClick={() => this.props.update(this.props.itemId, this.props.item)}>
                    <b>ItemID:</b> {this.props.item.id} <br></br>
                    <b>Name:</b> {this.props.item.itemName} <br></br>
                    <b>Amount:</b> {this.props.item.quantity} <br></br>
                    <b>Table Number:</b> {this.props.item.table + 1} <br></br>
                    {this.displayComment()}
                </button>
            );
        } else {
            return (
                <button className={classes.itemContainer} onClick={() => this.props.update(this.props.itemId, this.props.item)}>
                    <b>ItemID:</b> {this.props.item.id} <br></br>
                    <b>Name:</b> {this.props.item.itemName} <br></br>
                    <b>Amount:</b> {this.props.item.quantity} <br></br>
                    <b>Table Number:</b> {this.props.item.table + 1} <br></br>
                    {this.displayComment()}
                </button>
            );
        }
    }
}

export default withStyles(styles)(ItemCont);