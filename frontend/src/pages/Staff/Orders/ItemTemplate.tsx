import React from 'react';
import { createStyles, WithStyles, Theme, withStyles } from '@material-ui/core';
import {ListItem} from '../../../api/models';
//Personal note:
//Props is what is passed in {declare in interface}
//state is what you store {decalre in react component}

const styles = (theme: Theme) =>
    createStyles({
        itemContainer: {
            border: '1px solid grey',
            position: 'static',
            borderRadius: '10px',
            width: '94%',
            flexGrow: 1,
            marginLeft: '3%',
            marginRight: '3%',
            height: 'auto',
            marginTop: '10px',
            overflow: 'hidden',
            padding: '4px 0px 4px 0px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(200, 231, 250, 1) 100%)',
            boxShadow: "0px 6px 8px 0 rgba(0, 0, 0, 0.2)",
        }
    });

export interface IProps extends WithStyles<typeof styles> {
    item: ListItem,
    itemId: number,
    update: any,
}

class ItemCont extends React.Component<IProps, {}>{

    render() {
        const { classes } = this.props;
        return (
            <button className={classes.itemContainer} onClick={() => this.props.update(this.props.itemId, this.props.item)}>
                <b>ItemID:</b> {this.props.itemId} <br></br>
                <b>Item Name:</b> {this.props.item.itemName} <br></br>
                <b>Amount:</b> {this.props.item.quantity} <br></br>
                <b>Price:</b> {this.props.item.price}
            </button>
        );
    }
}

export default withStyles(styles)(ItemCont);