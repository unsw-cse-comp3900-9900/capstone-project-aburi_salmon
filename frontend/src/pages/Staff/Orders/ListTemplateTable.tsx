import React from 'react';
import { createStyles, WithStyles, Theme, withStyles } from '@material-ui/core';
import ItemCont from './../Orders/ItemTemplate';


const styles = (theme: Theme) =>
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
            
            //backgroundColor: 'lightgreen',  
            //display: 'block',
            //backgroundColor: 'lightgreen'
        },
        headingServed: {
            height: '50px',
            border: '2px solid green',
            //backgroundColor: 'rgb(0, 204, 51)',  
            //backgroundColor: 'rgb(0, 204, 0)',
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
            padding: '20px 5px 5px 5px',
            background: 'linear-gradient(0deg, rgba(160, 235, 176, 1) 0%, rgba(255, 255, 255, 1) 100%)',
        },

        boxToBeServed: {
            verticalAlign: 'top',
            flexGrow: 1,
            width: '100%',
            padding: '20px 5px 5px 5px',
            background: 'linear-gradient(0deg, rgba(255, 254, 218, 1) 0%, rgba(255, 255, 255, 1) 100%)',

        },

        boxQueue: {
            verticalAlign: 'top',
            flexGrow: 1,
            width: '100%',
            padding: '20px 5px 5px 5px',
            background: 'linear-gradient(0deg, rgba(133, 160, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)',
        },

        scroll: {
            height: '100%',
            display: 'block',
            overflow: 'auto',
            flexGrow: 1,
        },
        table2: {
            //border: '1px solid darkgreen',
            height: '100%',
            position: 'static',
            float: 'left',
            borderCollapse: 'collapse',
            flexGrow: 1,
            width: '100%',
        }
        
    });
export interface IProps extends WithStyles<typeof styles> {
    name: string;
 }

class ListContainer extends React.Component<IProps, {}>{

    constructor(props: any){
        super(props);
    }

    getHeading(){
        if (this.props.name === 'Served' || this.props.name === 'Ready'){
            return(
                <tr className={this.props.classes.headingServed}>
                    <th className={this.props.classes.headingServed}>
                        {this.props.name}
                    </th>
                </tr>
            );
        } else if (this.props.name === 'To Be Served' || this.props.name === 'Cooking') {
            return (
                <tr className={this.props.classes.headingToBeServed}>
                    <th className={this.props.classes.headingToBeServed}>
                        {this.props.name}
                    </th>
                </tr>
            );
        } else {
            return (
                <tr className={this.props.classes.headingQueue}>
                    <th className={this.props.classes.headingQueue}>
                        {this.props.name}
                    </th>
                </tr>
            );
        }
    }

    getBox(){
        if (this.props.name === 'Served' || this.props.name === 'Ready') {
            return (
                <td className={this.props.classes.boxServed}>
                    <ItemCont />
                </td>
            );
        } else if (this.props.name === 'To Be Served' || this.props.name === 'Cooking') {
            return (
                <td className={this.props.classes.boxToBeServed}>
                    <ItemCont />
                </td>
            );
        } else {
            return (
                <td className={this.props.classes.boxQueue}>
                    <ItemCont />
                </td>
            );
        }
    }



    render() {
        const { classes } = this.props;
        return (
            
                <table className={classes.table}>
                    {this.getHeading()}
                    <div className={classes.scroll}>
                        <table className={classes.table2}>
                        <tr>
                            {this.getBox()}
                        </tr>
                        
                        </table>
                    </div>
                </table>
        );
    }
}

export default withStyles(styles)(ListContainer);