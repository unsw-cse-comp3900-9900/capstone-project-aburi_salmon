import React from 'react';
import { createStyles, WithStyles, Theme, withStyles, Button, Box } from '@material-ui/core';
import { Client } from './../../../api/client';
import { TableInfo } from './../../../api/models'


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
            overflow: 'auto',
            display: 'block',
        },
        text: {
            float: 'left',
        },
        paidBut: {
            float: 'right',
        },
        itemTable: {
            width: '100%',
        },
        empty: {
            textAlign: 'center',
            paddingTop: '20%',
           
        }, 
        bottom: {
            bottom: '10%',
        },
        center: {
            textAlign: 'center',
        }
    });
export interface IProps extends WithStyles<typeof styles> {
    tableNumber: number,
    assistance: boolean,
    isEmpty: boolean | undefined,
}

interface IState {
    tableInfo: TableInfo | null,
    hide: string,
    itemsOrdered: number | undefined,
}

class TableInfoClass extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        if (!this.props.assistance){
            var temp = 'none';
        } else {
            var temp = 'block';
        }
        this.state = {
            tableInfo: null,
            hide: temp,
            itemsOrdered: 0,
        }
    }

    async componentDidMount() {
        //console.log(this.props.isEmpty);
        if (this.props.isEmpty){
            const client = new Client()
            const t: TableInfo | null = await client.getTableOrders(this.props.tableNumber);
            this.setState({ tableInfo: t});
            if (t?.items !== undefined){
                this.setState({itemsOrdered: t?.items.length})
            }
            console.log(t);
        }
        console.log(this.props.assistance);
    }

    printItems(){
        let children: Array<any> = [];
        let ret = [];
        if (this.state.tableInfo !== null) {
            if (this.state.itemsOrdered !== undefined && this.state.itemsOrdered> 0){
                this.state.tableInfo?.items.map(item => (
                    children.push(
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                        </tr>
                    )
                ));
                ret.push(
                    <table className={this.props.classes.itemTable}>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Cost (per item)</th>
                        </tr>
                        {children}
                    </table>
                );
                return ret;
            }
        }
    }

    noItemsOrdered(){
        console.log('items ordered: ' + this.state.itemsOrdered);
        if (this.state.itemsOrdered === 0){
            console.log('items ordered: ' + this.state.itemsOrdered);
            return (
                    <div className={this.props.classes.center}>
                        No items ordered yet
                    </div>
                );
        }
    }

    problemResolved(){
        this.setState({ hide: "none" });
    }

    render() {
        const { classes } = this.props;
        //this.grabTableInfo();
        if (this.props.isEmpty){
            return (
                <div className={classes.wrapper}>
                    <h1 className = {classes.text}>Table {this.props.tableNumber + 1}</h1>
                    <Box display={this.state.hide} displayPrint="none">
                        <Button color='secondary' variant="contained" className={classes.paidBut}
                            onClick={() => this.problemResolved()}
                                        >Resolved</Button>
                    </Box>                
                    <hr className={classes.line}></hr>
                
                    {this.printItems()}
                    {this.noItemsOrdered()}
                    <hr className={classes.line}></hr>
                    <br></br>
                    <b>Total: ${this.state.tableInfo?.total_cost}</b>
                    <Button color='primary' variant="contained" className={classes.paidBut}
                    >paid</Button>
                   
                </div>
            );
        } else {
            return(
                <div className={classes.empty}>
                    <h1>This table is empty</h1>
                </div>
            );
        }
    }
}

export default withStyles(styles)(TableInfoClass);