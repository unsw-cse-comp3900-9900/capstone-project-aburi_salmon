import React from 'react';
import { WithStyles, withStyles } from '@material-ui/core';
import ItemCont from './ItemTemplate';
import { ItemList} from './../../../../../api/models';
import {styles} from './styles';

//just for styling purposes
//renders the table list for cooking

export interface IProps extends WithStyles<typeof styles> {
    update: any;
    someList: ItemList | null;
    lastClicked: number;
    headingStyle: any;
    boxStyle: any;
    name: string;
 }

class OrderContainer extends React.Component<IProps, {}>{
    getHeading(){
        return (
            <thead>
                <tr className={this.props.headingStyle}>
                    <th className={this.props.headingStyle}>
                        {this.props.name}
                    </th>
                </tr>
            </thead>
        );
    }

    getBox(){
        if (this.props.someList !== null && this.props.someList.itemList !== undefined){
            return (
                <td className={this.props.boxStyle}>
                    {this.props.someList?.itemList.map((item, index) => (
                        <ItemCont key={index} itemId={index} item={item} realId={item.id}
                            update={this.props.update} lastClicked={this.props.lastClicked}/>
                    ))}
                </td>
            );
        } else {
            return(
                <td className={this.props.boxStyle}>
                    No orders here...
                </td >
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

export default withStyles(styles)(OrderContainer);