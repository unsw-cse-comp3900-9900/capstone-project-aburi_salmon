import React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import ItemCont from './../Orders/ItemTemplate';
import { ItemList} from '../../../api/models';
import { Client } from '../../../api/client';

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
        headingServed: {
            height: '50px',
            border: '2px solid green',
            background: 'radial-gradient(circle, rgba(148, 233, 152, 1) 0%, rgba(56, 171, 87, 1) 73%)',
        },

        headingToBeServed: {
            height: '50px',
            border: '2px solid green',
            background: 'radial-gradient(circle, rgba(250, 255, 161, 1) 0%, rgba(255, 254, 92, 1) 73%)',
        },

        headingQueue: {
            height: '50px',
            border: '2px solid green',
            background: 'radial-gradient(circle, rgba(161, 237, 255, 1) 0%, rgba(126, 141, 255, 1) 73%)',
        },

        boxServed: {
            verticalAlign: 'top',
            flexGrow: 1,
            width: '100%',
            padding: '10px 5px 5px 10px',
            background: 'linear-gradient(0deg, rgba(160, 235, 176, 1) 0%, rgba(255, 255, 255, 1) 100%)',
        },

        boxToBeServed: {
            verticalAlign: 'top',
            flexGrow: 1,
            width: '100%',
            padding: '10px 5px 5px 10px',
            background: 'linear-gradient(0deg, rgba(255, 254, 218, 1) 0%, rgba(255, 255, 255, 1) 100%)',

        },

        boxQueue: {
            verticalAlign: 'top',
            flexGrow: 1,
            width: '100%',
            padding: '10px 5px 5px 10px',
            background: 'linear-gradient(0deg, rgba(177, 194, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)',
            //background: 'linear-gradient(0deg, rgba(133, 160, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)',
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
    name: string; //= {'Served', 'Ready', 'To Be Served', 'Cooking'}
    update: any;
 }


class ListContainer extends React.Component<IProps, {itemList: ItemList | null}>{

    constructor(props: IProps){
        super(props);
        this.state = {
            itemList: null,
        }

    }

    async componentDidMount() {
        const client = new Client();
        if (this.props.name === 'Queue'){
            const m: ItemList | null = await client.getListItem(1);
            this.setState({
                itemList: m
            });
            console.log(m);
        } else if (this.props.name === 'Cooking') {
            const m: ItemList | null = await client.getListItem(2);
            this.setState({
                itemList: m
            });
            console.log(m);
        } else if (this.props.name === 'To Be Served') {
            const m: ItemList | null = await client.getListItem(3);
            this.setState({
                itemList: m
            });
            console.log(m);
        } else if (this.props.name === 'Ready') {
            const m: ItemList | null = await client.getListItem(3);
            this.setState({
                itemList: m
            });
            console.log(m);
        } else if (this.props.name === 'Served') {
            const m: ItemList | null = await client.getListItem(4);
            this.setState({
                itemList: m
            });
            console.log(m);
        }
    }

    //Get items depending on name
    getHeading(){
        if (this.props.name === 'Served' || this.props.name === 'Ready'){
            return(
                <thead>
                    <tr className={this.props.classes.headingServed}>
                        <th className={this.props.classes.headingServed}>
                            {this.props.name}
                        </th>
                    </tr>
                </thead>
             
            );
        } else if (this.props.name === 'To Be Served' || this.props.name === 'Cooking') {
            return (
                <thead>
                    <tr className={this.props.classes.headingToBeServed}>
                        <th className={this.props.classes.headingToBeServed}>
                            {this.props.name}
                        </th>
                    </tr>
                </thead>
            );
        } else {
            return (
                <thead>
                    <tr className={this.props.classes.headingQueue}>
                        <th className={this.props.classes.headingQueue}>
                            {this.props.name}
                        </th>
                    </tr>
                </thead>
            );
        }
    }

    getBox(){
        if (this.props.name === 'Ready') {
            if (this.state.itemList?.itemList !== null) {
                return (

                    <td className={this.props.classes.boxServed}>
                        {this.state.itemList?.itemList.map((item, index) => (
                            <ItemCont listName="Queue" itemName={item.itemName} amount={item.quantity}
                                table={item.item_id} time="sometime" itemId ={index}
                                update={this.props.update} />
                        ))}
                    </td>
                );
            } else {
                return (
                    <td className={this.props.classes.boxServed}>
                    </td>
                );
            }
        } else if (this.props.name === 'Served') {
            if (this.state.itemList?.itemList !== null) {
                return (

                    <td className={this.props.classes.boxServed}>
                        {this.state.itemList?.itemList.map((item, index) => (
                            <ItemCont listName="Queue" itemName={item.itemName} amount={item.quantity}
                                table={item.item_id} key={item.item_id} time="sometime" itemId={index}
                                update={this.props.update} />
                        ))}
                    </td>
                );
            } else {
                return (
                    <td className={this.props.classes.boxServed}>
                    </td>
                );
            }
        } else if (this.props.name === 'To Be Served') {
            if (this.state.itemList?.itemList !== null) {
                return (
                    <td className={this.props.classes.boxToBeServed}>
                        {this.state.itemList?.itemList.map((item, index) => (
                            <ItemCont listName="Queue" itemName={item.itemName} amount={item.quantity}
                                table={item.item_id} key={item.item_id} time="sometime" itemId={index}
                                update={this.props.update} />
                        ))}
                    </td>
                );
            } else {
                return (
                    <td className={this.props.classes.boxToBeServed}>
                    </td>
                );
            }
        } else if (this.props.name === 'Cooking') {
            if (this.state.itemList?.itemList !== null) {
                return (

                    <td className={this.props.classes.boxToBeServed}>
                        {this.state.itemList?.itemList.map((item, index) => (
                            <ItemCont listName="Queue" itemName={item.itemName} amount={item.quantity}
                                table={item.item_id} time="sometime" itemId={index}
                                update={this.props.update} />
                        ))}
                    </td>
                );
            } else {
                return (
                    <td className={this.props.classes.boxToBeServed}>
                    </td>
                );
            }
        } else if (this.props.name === 'Queue'){
            
            if (this.state.itemList?.itemList !== null){
                return (
                    
                    <td className={this.props.classes.boxQueue}>
                    {this.state.itemList?.itemList.map((item, index) => (
                        <ItemCont listName="Queue" itemName={item.itemName} amount={item.quantity} 
                                table={item.item_id} time="sometime" itemId={index}
                                update={this.props.update} />
                        ))}
                    </td>
                );
            } else {
                return(
                    <td className={this.props.classes.boxQueue}>
                    </td>
                );
            }
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

export default withStyles(styles)(ListContainer);