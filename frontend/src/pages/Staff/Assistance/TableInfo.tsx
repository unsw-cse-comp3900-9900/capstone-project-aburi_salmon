import React from 'react';
import { createStyles, WithStyles, Theme, withStyles, Button, Box,  Snackbar } from '@material-ui/core';
import { Client } from './../../../api/client';
import { TableInfo } from './../../../api/models';
import { Alert } from '@material-ui/lab';


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
        },
        wrapper1: {
            width: '100%',
            paddingLeft: '2%',
            height: '85%',
            paddingRight: '2%',
            overflow: 'auto',
            display: 'block',
        },
        wrapper2: {
            width: '100%',
            paddingLeft: '2%',
            height: '10%',
            paddingRight: '2%',
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
           display: 'flex',
           justifyContent: 'center',
            height: '95%',
        }, 
        bottom: {
            bottom: '10%',
        },
        center: {
            textAlign: 'center',
        },
        centerText: {
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }
    });
export interface IProps extends WithStyles<typeof styles> {
    tableNumber: number,
    assistance: boolean,
    isEmpty: boolean | undefined,
    paidFunction: any,
}

interface IState {
    tableInfo: TableInfo | null,
    hide: string,
    itemsOrdered: number | undefined,
    order_id: number,
    isOpen: boolean,
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
    }

    async componentDidMount() {
        if (this.props.isEmpty){
            const client = new Client()
            const t: TableInfo | null = await client.getTableOrders(this.props.tableNumber);
            console.log(t);
            this.setState({ tableInfo: t});
            if (t?.items !== undefined){
                this.setState({itemsOrdered: t?.items.length, order_id:t.order_id})
            }
        }
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

    noItemsOrdered(){
        if (this.state.itemsOrdered === 0){
            return (
                <div className={this.props.classes.center}>
                    No items ordered yet
                </div>
            );
        }
    }

    showAlert() {
        return (
            <Snackbar
                open={this.state.isOpen}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={this.state.alertSeverity}
                    action={
                        <Button color="inherit" size="small" onClick={() => this.setState({ isOpen: false })}>
                            OK
                            </Button>
                    }
                >{this.state.alertMessage}</Alert>
            </Snackbar>
        );
    }

    problemResolved(){
        const client = new Client();
        client.assistance(this.state.order_id, false)
            .then((msg) => {
                if (msg.status === 200) {
                    //alert('problem resolved');
                    this.setState({isOpen: true, alertSeverity: "success", alertMessage: "Problem Resolved"});
                } else {
                    this.setState({ isOpen: true, alertSeverity: "error", alertMessage: msg.statusText });
                    //alert(msg.statusText);
                }
            }).catch((status) => {
                console.log(status);
            });
    }

    async freeTable(){
        const client = new Client();
        await client.assistance(this.props.tableNumber, false)
            .then((msg) => {
                if (msg.status === 200) {
                    this.setState({ isOpen: true, alertSeverity: "success", alertMessage: "Table Freed" });
                    this.props.paidFunction();
                    
                } else {
                    this.setState({ isOpen: true, alertSeverity: "error", alertMessage: msg.statusText });
                }
                
            }).catch((status) => {
                console.log(status);
            });
    }

    render() {
        const { classes } = this.props;
        if (this.props.isEmpty){
            return (
                <div className={classes.wrapper}>
                    {this.showAlert()}
                    <div className={classes.wrapper1}>
                        <h1 className = {classes.text}>Table {this.props.tableNumber + 1}</h1>
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
                    <h1>Table {this.props.tableNumber + 1} is empty</h1>
                </div>
            );
        }
    }
}

export default withStyles(styles)(TableInfoClass);