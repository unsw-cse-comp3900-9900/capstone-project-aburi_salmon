import React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import ItemCont from './ItemTemplate';
import { ItemList} from '../../../api/models';


const styles = () =>
    createStyles({
        table: {
            border: '2px solid darkgreen',
            height: '95%',
            position: 'static',
            float: 'left',
            marginLeft: '5%',
            marginRight: '5%',
            marginTop: '10px',
            marginBottom: '10px',
            borderCollapse: 'collapse',
            flexGrow: 1,
            width: '100%',
            boxShadow: "2px 7px 12px 0 rgba(0, 0, 0, 0.4)",
        },
        headingToBeServed: {
            height: '50px',
            border: '2px solid green',
            background: 'radial-gradient(circle, rgba(250, 255, 161, 1) 0%, rgba(255, 254, 92, 1) 73%)',
        },

        boxToBeServed: {
            verticalAlign: 'top',
            flexGrow: 1,
            width: '100%',
            padding: '10px 5px 5px 10px',
            background: 'linear-gradient(0deg, rgba(255, 254, 218, 1) 0%, rgba(255, 255, 255, 1) 100%)',

        },
        scroll: {
            height: '100%',
            display: 'block',
            overflow: 'auto',
            flexGrow: 1,
        },
        table2: {
            height: '100%',
            position: 'static',
            float: 'left',
            borderCollapse: 'collapse',
            flexGrow: 1,
            width: '100%',
        }
        
    });
export interface IProps extends WithStyles<typeof styles> {
    update: any;
    someList: ItemList | null;
    lastClicked: number;
 }

class Cooking extends React.Component<IProps, {}>{
    getHeading(){
        return (
            <thead>
                <tr className={this.props.classes.headingToBeServed}>
                    <th className={this.props.classes.headingToBeServed}>
                        Cooking
                    </th>
                </tr>
            </thead>
        );
    }

    getBox(){
        if (this.props.someList !== null && this.props.someList.itemList !== undefined){
            return (
                <td className={this.props.classes.boxToBeServed}>
                    {this.props.someList?.itemList.map((item, index) => (
                        <ItemCont key={index} itemId={index} item={item} realId={item.id}
                            update={this.props.update} lastClicked={this.props.lastClicked}/>
                    ))}
                </td>
            );
        } else {
            return(
                <td className={this.props.classes.boxToBeServed}>
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

export default withStyles(styles)(Cooking);