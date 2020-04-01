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
            height: '90%',
            width: '100%',
            overflow: 'auto',
        },
        container2: {
            //border: '1px solid grey',
            height: '10%',
            width: '100%',
        },
        container3: {
            //border: '1px solid grey',
            height: '100%',
            width: '100%',

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
    assistance: Array<number>,
}

class Assistance extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);
        this.state = {
            numTables: 15,
            selectedTable: 0, //Selected table, 0 means none selected
            main: true, //main screen
            tables: null,
            assistance: [],
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
        var temp: Array<number> = [];
        a?.tables.map(it => {
                temp.push(it.table_id);
            }
        )
        this.setState({ tables: t, assistance: temp });
        console.log(t);
        //console.log('ass' + temp);
        //console.log(a?.tables);
        //console.log(a?.tables[3]);
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
            console.log(item);
            console.log(tablenum);
            if(item === tablenum){
                console.log('entered');
                ret = true;
            }
        })
        return ret;
    }

    render() {
        if (this.state.main) {
            return (
                <div className={this.props.classes.container3}>
                    <div className={this.props.classes.container}>
                        <h1>Tables</h1>
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