import React from 'react';
import {  withStyles, WithStyles, Link, Dialog, DialogTitle,DialogContent,  DialogActions,Button} from '@material-ui/core';
import './../Assistance/Assistance.css';
import TableInfo from './../Assistance/TableInfo';
import { Tables as TableModel } from './../../../../api/models';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {styles} from './styles';

//https://material-ui.com/components/menus/#menus
//https://stackoverflow.com/questions/58630490/how-to-convert-functional-componenet-to-class-component-in-react-in-material

export interface IProps extends WithStyles<typeof styles> {
    tables: TableModel | null,
    assistance: Array<number>, 
    update: any,
    billRequest: Array<number>
} 

interface IState{
    numTables: number,
    selectedTable: number,
    main: boolean,
    resetOpen: boolean,

}

class Assistance extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);
        this.state = {
            numTables: 15,
            selectedTable: 0, //Selected table, 0 means none selected
            main: true, //main screen
            resetOpen: false,
        }
        this.needAssistance = this.needAssistance.bind(this);
        this.paid = this.paid.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(tableNum: number){
        this.setState({selectedTable: tableNum});
        this.setState({main: false});
    }

    createTables = () => {
        let table = [];
        let i = 0;
        let j = 0;
        let children = [];
        if(this.props.tables !== null){
            while(i*5 + j < this.props.tables?.tables.length){
                while (i * 5 + j < this.props.tables?.tables.length && j < 5){
                    const tableNum = i*5 + j; //starts from 0
                    if (this.props.tables !== null && this.props.tables?.tables[tableNum].occupied){ 
                        if (this.props.assistance !== [] && this.props.assistance.some(it => tableNum === it)){
                            children.push(
                                <div className="column" key={tableNum} onClick={() => this.handleClick(tableNum)}>
                                    <div className="redcard">{tableNum}
                                    </div>
                                </div>
                            )
                        } else if (this.props.billRequest !== [] && this.props.billRequest.some(it => tableNum === it)){
                            children.push(
                                <div className="column" key={tableNum} onClick={() => this.handleClick(tableNum)}>
                                    <div className="billcard"> {'!!! ' + tableNum + ' !!!'}
                                    </div>
                                </div>
                            )
                        } else {
                            children.push(
                                <div className="column" key={tableNum} onClick={() => this.handleClick(tableNum)}>
                                    <div className="greencard">{tableNum}
                                    </div>
                                </div>
                            )
                        }
                    } else {
                        children.push(
                            <div className="column" key={tableNum} onClick={() => this.handleClick(tableNum)}>
                                <div className="card">{tableNum}</div>
                            </div>
                        )
                    }
                    j = j + 1;
                }
                j = 0;
                i = i + 1;
            }
            table.push(
                <div className="row" key={i}>{children}</div>
            )
        }
        return table;
    }

    backToTables(){
        this.setState({ selectedTable: 0 });
        this.setState({ main: true });
    }

    paid(){
        this.props.update();
    }

    tableKey(){
        return(
            <div className={this.props.classes.key}>
                <mark className={this.props.classes.red}>Red = Assistance Required</mark>, 
                <mark className={this.props.classes.green}> Green = Occupied </mark>, Grey = Empty,
                <mark className={this.props.classes.green}> Bordered = Bill Requested</mark>
            </div>
        );
    }

    needAssistance(tablenum: number):boolean{
        var ret = false;
        this.props.assistance.forEach((item: number) =>{
            if(item === tablenum){
                ret = true;
            }
        })
        return ret;
    }

    helpDialog() {
        return (
            <div>
                <Dialog open={this.state.resetOpen} onClose={() => this.setState({ resetOpen: false })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Help</DialogTitle>
                    <DialogContent>
                        Each rectangle represents a table with the table number in the middle. Tap on a rectangle to view information about that table.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ resetOpen: false })} color="primary">
                            Ok, I get it
                        </Button>
                        
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    render() {
        if (this.state.main) {
            return (
                <div className={this.props.classes.container3}>
                    <div className={this.props.classes.container}>
                        {this.helpDialog()}
                        <h1>Tables <div className={this.props.classes.helpIcon} onClick={() => this.setState({resetOpen: true})}><HelpOutlineIcon /></div></h1>
                        {this.createTables()}
                    </div>
                    <div className={this.props.classes.container2}>
                        {this.tableKey()}
                    </div>
                </div>
            );
        } else {
            return (
                <div className={this.props.classes.wrapper}>
                    <Link onClick={()=>this.backToTables()} > Back to tables</Link>
                    <TableInfo tableNumber={this.state.selectedTable} assistance={this.needAssistance(this.state.selectedTable)}
                        isEmpty={this.props.tables?.tables[this.state.selectedTable].occupied} paidFunction={this.paid}/>
                </div>
            )
        };
    }
}

export default withStyles(styles)(Assistance);