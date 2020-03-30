import React from 'react';
import {  createStyles, withStyles, WithStyles, Theme, Link} from '@material-ui/core';
import './../Assistance/Assistance.css';
import TableInfo from './../Assistance/TableInfo';
import { Tables as TableModel, AssistanceTable, AssistanceTables } from './../../../api/models';
import { Client } from './../../../api/client';
//https://material-ui.com/components/menus/#menus
//https://stackoverflow.com/questions/58630490/how-to-convert-functional-componenet-to-class-component-in-react-in-material

// How to use withStyles in TS
const styles = (theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },      
        container: {
            //border: '1px solid grey',
            height: '100%',
            width: '100%',
            overflow: 'auto',
        },
        wrapper: {
            width: '100%',
            //paddingLeft: '2%',
            //paddingRight: '2%',
            textAlign: 'left',

        },
        key: {
            position: 'relative',
            bottom:'-25%',
            //border: '1px solid black'
        },
        red: {
            color: 'red',
            backgroundColor: 'white',
        },
        green:{
            color: 'green',
            backgroundColor: 'white',
        },

    });
export interface IProps extends WithStyles<typeof styles> {} 

interface IState{
    numTables: number,
    selectedTable: number,
    main: boolean,
    tables: TableModel | null,
    assistance: AssistanceTables | null,
}

class Assistance extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);
        this.state = {
            numTables: 15,
            selectedTable: 0, //Selected table, 0 means none selected
            main: true, //main screen
            tables: null,
            assistance: null,
        }
    }
    
    handleClick(tableNum: number){
        this.setState({selectedTable: tableNum});
        this.setState({main: false});
    }

    async componentDidMount() {
        const client = new Client()
        const t: TableModel | null = await client.getTables();
        const a: AssistanceTables | null = await client.getAssistanceTable();
        this.setState({ tables: t, assistance: a });
        console.log(t);
    }

    createTables = () => {
        let table = [];
        let i = 0;
        let j = 0;
        let children = [];
        if(this.state.tables !== null){
            while(i*5 + j < this.state.tables?.tables.length){
                while (i * 5 + j < this.state.tables?.tables.length && j < 5){
                    const tableNum = i*5 + j;
                    if (this.state.tables !== null && this.state.tables?.tables[tableNum].occupied){
                        children.push(
                            <div className="column" key={tableNum + 1} onClick={() => this.handleClick(tableNum + 1)}>
                                <div className="card">{tableNum + 1}
                                </div>
                            </div>
                        )

                    } else {
                        children.push(
                            <div className="column" key={tableNum + 1} onClick={() => this.handleClick(tableNum + 1)}>
                                <div className="greencard">{tableNum + 1}</div>
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

    tableKey(){
        return(
            <div className={this.props.classes.key}>
                <mark className={this.props.classes.red}>Red = Assistance Required</mark>, 
                <mark className={this.props.classes.green}> Green = Empty </mark>, Grey = Occupied
            </div>
        );
    }

    needAssistance(tablenum: number):boolean{
        this.state.assistance?.table.forEach((item: AssistanceTable) =>{
            if(item.table_id === tablenum){
                return item.occupied;
            }
        })
        return false
    }

    render() {
        if (this.state.main) {
            return (
                <div className={this.props.classes.container}>
                    <h1>~~ Tables ~~</h1>
                    {this.createTables()}
                    {this.tableKey()}
                </div>
            );
        } else {
            return (
                <div className={this.props.classes.wrapper}>
                    <Link onClick={()=>this.backToTables()} > Back to tables</Link>
                    <TableInfo tableNumber={this.state.selectedTable} assistance={this.needAssistance(this.state.selectedTable)}/>
                </div>
            )
        };
    }
}

export default withStyles(styles)(Assistance);