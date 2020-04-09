import React from 'react';
import { WithStyles, withStyles } from '@material-ui/core';
import ItemCont from './ItemTemplate';
import { ItemList } from './../../../../../api/models';
import {styles }from './styles';

export interface IProps extends WithStyles<typeof styles> {
    update: any;
    someList: ItemList | null;
    lastClicked: number,
}

class Served extends React.Component<IProps, {}>{
    //Get items depending on name
    getHeading() {
        return (
            <thead>
                <tr className={this.props.classes.headingServed}>
                    <th className={this.props.classes.headingServed}>
                        Served
                    </th>
                </tr>
            </thead>
        );
    }

    getBox() {
        if (this.props.someList !== null && this.props.someList.itemList !== undefined) {
            return (

                <td className={this.props.classes.boxServed}>
                    {this.props.someList?.itemList.map((item,index) => (
                        <ItemCont key={index} itemId={index} item={item} realId={item.id}
                            update={this.props.update} lastClicked={this.props.lastClicked}/>
                    ))}
                </td>
            );
        } else {
            return (
                <td className={this.props.classes.boxServed}>
                    No orders here...
                </td>
            );
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <table className={classes.table}>
                {this.getHeading()}
                <tbody>
                    <tr >
                        <td className={classes.scroll}>
                            <table className={classes.table2}>
                                <tbody>
                                    <tr>
                                        {this.getBox()}
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default withStyles(styles)(Served);