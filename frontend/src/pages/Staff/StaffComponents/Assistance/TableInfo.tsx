import React from 'react';
import {  WithStyles, withStyles, Button, Box } from '@material-ui/core';
import { Client } from './../../../../api/client';
import { TableInfo, ResponseMessage as ResponseMessageModel } from './../../../../api/models';
import AlertSnackbar from './../../../AlertSnackbar';
import {styles} from './styles';

//displays table info given table number


export interface IProps extends WithStyles<typeof styles> {
    tableNumber: number,
    assistance: boolean,  //whether table requires assistance
    isEmpty: boolean | undefined, //if true... table is not empty
    paidFunction: any,

}

interface IState {
    tableInfo: TableInfo | null, 
    hide: string,  //for hiding the problem 'resolved' button
    itemsOrdered: number | undefined, //no of items ordered
    order_id: number, //was once used to free table... not anymore
    isOpen: boolean, //for fancy alert
    alertMessage: string,
    alertSeverity: "error" | "success" ,
}

const statusArr = ['','Queue', 'Cooking', 'Ready', 'Served'];

class TableInfoClass extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        var temp = '';
        if (!this.props.assistance){
            temp = 'none';
        } else {
            temp = 'block';
        }
        this.state = {
            tableInfo: null,
            hide: temp,
            itemsOrdered: 0,
            order_id: -1,
            isOpen: false,
            alertMessage: 'somethings wrong',
            alertSeverity: 'error'
        }
        this.changeAlertState = this.changeAlertState.bind(this);
    }

    async componentDidMount() {
        if (this.props.isEmpty){
            const client = new Client()
            const t: TableInfo | null = await client.getTableOrders(this.props.tableNumber);
            this.setState({ tableInfo: t});
            if (t?.items !== undefined){
                this.setState({itemsOrdered: t?.items.length, order_id:t.order_id})
            }
        }
    }

    changeAlertState(isOpen: boolean){
        this.setState({isOpen: isOpen});
    }

    printItems(){
        let children: Array<any> = [];
        let ret = [];
        if (this.state.tableInfo !== null) {
            if (this.state.itemsOrdered !== undefined && this.state.itemsOrdered> 0){
                this.state.tableInfo?.items.map((item, index) => (
                    children.push(
                        <tr key={index}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                            <td>{statusArr[item.status_id]}</td>
                        </tr>
                    )
                ));
                ret.push(
                    <table className={this.props.classes.itemTable} key="table">
                        <thead>
                        <tr key="headings">
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Cost (per item)</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                            {children}
                        </tbody>
                    </table>
                );
                return ret;
            }
        }
    }

    //if no items ordered
    noItemsOrdered(){
        if (this.state.itemsOrdered === 0){
            return (
                <div className={this.props.classes.center}>
                    No items ordered yet
                </div>
            );
        }
    }

    async problemResolved(){
        const client = new Client();
        const r: ResponseMessageModel | null= await client.assistance(this.props.tableNumber, false);
        if (r === null){
            this.setState({ isOpen: true, alertSeverity: "error", alertMessage: "Something went wrong" });
        } else if (r?.status === "success") {
            this.setState({isOpen: true, alertSeverity: "success", alertMessage: "Problem Resolved", hide:'none'});
            this.props.paidFunction();
        } else {
            this.setState({ isOpen: true, alertSeverity: "error", alertMessage: r?.status });
        }
    }

    async freeTable(){
        const client = new Client();
        const r: ResponseMessageModel | null = await client.freeTable(this.props.tableNumber);
        if (r === null) {
            this.setState({ isOpen: true, alertSeverity: "error", alertMessage: "Something went wrong" });
        } else if (r?.status === "success") {
            this.setState({ isOpen: true, alertSeverity: "success", alertMessage: "Table Freed" });
            this.props.paidFunction();
        } else {
            this.setState({ isOpen: true, alertSeverity: "error", alertMessage: r?.status });
        }
    }

    render() {
        const { classes } = this.props;
        if (this.props.isEmpty){
            return (
                <div className={classes.wrappert}>
                    <AlertSnackbar isOpen={this.state.isOpen} severity={this.state.alertSeverity}
                        alertMessage={this.state.alertMessage} changeState={this.changeAlertState} />
                    <div className={classes.wrapper1}>
                        <h1 className = {classes.text}>Table {this.props.tableNumber}</h1>
                        <Box display={this.state.hide} displayPrint="none">
                            <Button color='secondary' variant="contained" className={classes.paidBut}
                                onClick={() => this.problemResolved()}
                                            >Resolved</Button>
                        </Box>                
                        <hr className={classes.line}></hr>
                    
                        {this.printItems()}
                        {this.noItemsOrdered()}
                    </div>
                    <div className={classes.wrapper2}>
                        <hr className={classes.line}></hr>
                        <br></br>
                        <b>Total: ${this.state.tableInfo?.total_cost}</b>
                        <Button color='primary' variant="contained" className={classes.paidBut} onClick={() => this.freeTable()}
                        >paid</Button>
                    </div>
                </div>
            );
        } else {
            return(
                <div className={classes.empty}>
                    <AlertSnackbar isOpen={this.state.isOpen} severity={this.state.alertSeverity}
                        alertMessage={this.state.alertMessage} changeState={this.changeAlertState} />
                    <h1>Table {this.props.tableNumber} is empty</h1>
                </div>
            );
        }
    }
}

export default withStyles(styles)(TableInfoClass);