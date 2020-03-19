import React from 'react';
import { createStyles, WithStyles, Theme, withStyles } from '@material-ui/core';


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
            height: '50px',
            overflow: 'auto',
            padding: '4px 0px 0px 0px',
            //background: 'radial-gradient(circle, rgba(255, 253, 238, 1) 0%, rgba(233, 233, 209, 1) 100%)',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(200, 231, 250, 1) 100%)',
            boxShadow: "0px 6px 8px 0 rgba(0, 0, 0, 0.2)",
        },
        line:{
            width: '100%',
        },
        wrapper: {
            width: '100%',
            paddingLeft: '2%',
            paddingRight: '2%',
        },
        text: {
            float: 'left',
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
                <p className={classes.text}>Nothing yet</p>
            </div>
        );
    }
}

export default withStyles(styles)(TableInfo);