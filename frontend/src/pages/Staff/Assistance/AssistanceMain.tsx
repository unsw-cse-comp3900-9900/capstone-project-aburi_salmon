import React from 'react';
import {  createStyles, withStyles, WithStyles, Theme, Link, Dialog, DialogTitle,DialogContent,  DialogActions,Button} from '@material-ui/core';
import './../Assistance/Assistance.css';
import TableInfo from './../Assistance/TableInfo';
import { Tables as TableModel, AssistanceTables } from './../../../api/models';
import { Client } from './../../../api/client';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
//https://material-ui.com/components/menus/#menus
//https://stackoverflow.com/questions/58630490/how-to-convert-functional-componenet-to-class-component-in-react-in-material


const styles = (theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },      
        container: {
            height: '90%',
            width: '100%',
            overflow: 'auto',
        },
        container2: {
            height: '10%',
            width: '100%',
        },
        container3: {
            height: '100%',
            width: '100%',
        },
        wrapper: {
            width: '100%',
            textAlign: 'left',
        },
        key: {
            position: 'relative',
            bottom:'-25%',
        },
        red: {
            color: 'red',
            backgroundColor: 'white',
        },
        green:{
            color: 'green',
            backgroundColor: 'white',
        },
        helpIcon: {
            float: 'right',
            paddingRight: '2.5%',
        },
    });
export interface IProps extends WithStyles<typeof styles> {} 

interface IState{
    numTables: number,
    selectedTable: number,
    main: boolean,
    tables: TableModel | null,
    assistance: Array<number>,
    resetOpen: boolean,
}

class Assistance extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);
        this.state = {
            numTables: 15,
            selectedTable: 0, //Selected table, 0 means none selected
            main: true, //main screen
            tables: null,
            assistance: [], //tables that require assistance
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


    async componentDidMount() {
        const client = new Client()
        const t: TableModel | null = await client.getTables();
        const a: AssistanceTables | null = await client.getAssistanceTable();
        var temp: Array<number> = [];
        if (a?.tables !== undefined){
            a?.tables.map(it => {
                    temp.push(it.table_id);
                }
            )
            this.setState({assistance: temp });
        }
        this.setState({tables:t})
    }

    createTables = () => {
        let table = [];
        let i = 0;
        let j = 0;
        let children = [];
        if(this.state.tables !== null){
            while(i*5 + j < this.state.tables?.tables.length){
                while (i * 5 + j < this.state.tables?.tables.length && j < 5){
                    const tableNum = i*5 + j; //starts from 0
                    if (this.state.tables !== null && this.state.tables?.tables[tableNum].occupied){ 
                        if (this.state.assistance !== [] && this.state.assistance.some(it => tableNum === it)){
                            children.push(
                                <div className="column" key={tableNum + 1} onClick={() => this.handleClick(tableNum)}>
                                    <div className="redcard">{tableNum + 1}
                                    </div>
                                </div>
                            )
                        } else {
                            children.push(
                                <div className="column" key={tableNum + 1} onClick={() => this.handleClick(tableNum)}>
                                    <div className="greencard">{tableNum + 1}
                                    </div>
                                </div>
                            )
                        }
                    } else {
                        children.push(
                            <div className="column" key={tableNum + 1} onClick={() => this.handleClick(tableNum)}>
                                <div className="card">{tableNum + 1}</div>
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
        this.setState({ selectedTable: 0 });
        this.setState({ main: true });
        this.componentDidMount();
    }

    tableKey(){
        return(
            <div className={this.props.classes.key}>
                <mark className={this.props.classes.red}>Red = Assistance Required</mark>, 
                <mark className={this.props.classes.green}> Green = Occupied </mark>, Grey = Empty
            </div>
        );
    }

    needAssistance(tablenum: number):boolean{
        var ret = false;
        this.state.assistance.forEach((item: number) =>{
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
                        isEmpty={this.state.tables?.tables[this.state.selectedTable].occupied} paidFunction={this.paid}/>
        
                </div>
            )
        };
    }
}

export default withStyles(styles)(Assistance);