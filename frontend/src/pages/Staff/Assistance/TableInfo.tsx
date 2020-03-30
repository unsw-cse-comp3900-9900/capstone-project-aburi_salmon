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
        }
    });
export interface IProps extends WithStyles<typeof styles> {
    tableNumber: number,
    assistance: boolean
}

interface IState {
    tableInfo: TableInfo | null,
    hide: string,
}

class TableInfoClass extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            tableInfo: null,
            hide: 'block',
        }
    }

    async componentDidMount() {
        const client = new Client()
        const t: TableInfo | null = await client.getTableOrders(this.props.tableNumber);
        this.setState({ tableInfo: t });
        console.log(t);
    }

    printItems(){
        let children: Array<any> = [];
        let ret = [];

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

    problemResolved(){
        //const client = new Client();
        this.setState({ hide: "none" });
    }

    render() {
        const { classes } = this.props;
        //this.grabTableInfo();
        return (
            <div className={classes.wrapper}>
                <h1 className = {classes.text}>Table {this.props.tableNumber}</h1>
                <Box display={this.state.hide} displayPrint="none">
                    <Button color='secondary' variant="contained" className={classes.paidBut}
                        onClick={() => this.problemResolved()}
                                    >Resolved</Button>
                </Box>                
                <hr className={classes.line}></hr>
              
                {this.printItems()}
                <hr className={classes.line}></hr>
                <br></br>
                Total: ${this.state.tableInfo?.total_cost}
                <Button color='primary' variant="contained" className={classes.paidBut}
                >paid</Button>
            
            </div>
        );
    }
}

export default withStyles(styles)(TableInfoClass);