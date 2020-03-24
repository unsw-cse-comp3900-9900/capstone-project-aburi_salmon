import React from 'react';
import {  createStyles, withStyles, WithStyles, Theme, Link} from '@material-ui/core';
import './../Assistance/Assistance.css';
import TableInfo from './../Assistance/TableInfo';
import { Tables as TableModel } from './../../../api/models';
import { Client } from './../../../api/client';
//https://material-ui.com/components/menus/#menus
//https://stackoverflow.com/questions/58630490/how-to-convert-functional-componenet-to-class-component-in-react-in-material

/*
Files:
Staff.tsx
    - deals with navigation
    - needs to know the staff to know which tabs to display
    - will display name and staff type

StaffContainer.tsx
    - is the container that will display the elements

ItemTemplate.tsx
    - the template for listing information about an item
    - will be displayed with float in ListTemplate

ListTemplate.tsx
    - template for storing items
*/


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


class Assistance extends React.Component<IProps, {
    numTables: number,
    selectedTable: number,
    main: boolean,
    tables: TableModel | null,
}>{
    constructor(props: IProps){
        super(props);
        this.state = {
            numTables: 15,
            selectedTable: 0, //Selected table, 0 means none selected
            main: true, //main screen
            tables: null,
        }
    }
    
    handleClick(tableNum: number){
        this.setState({selectedTable: tableNum});
        this.setState({main: false});
    }

    async componentDidMount() {
        const client = new Client()
        const t: TableModel | null = await client.getTables();
        this.setState({ tables: t });
        console.log(t);
    }

    
    createTables = () => {
        let table = [];
        for (let i = 0; i < 3; i++){
            let children = [];
            for (let j = 0; j < 5; j++){
                const tableNum = i*5 + j;
                if (this.state.tables?.tables[tableNum].occupied){
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
            }

            table.push(
                <div className="row" key={i}>{children}</div>
            )
        }
        return table;
    }


    display(){
        if(this.state.main){
            return (
                <div className={this.props.classes.container}>
                    <h1>Tables</h1>
                    {this.createTables()}
                </div>
            );
        } else {
            return(
                <TableInfo tableNumber={this.state.selectedTable}/>
            )
        }
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
                    <TableInfo tableNumber={this.state.selectedTable} />
                </div>
            )
        };
    }
}

export default withStyles(styles)(Assistance);