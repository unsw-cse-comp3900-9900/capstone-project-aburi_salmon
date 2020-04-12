import React from 'react';
import { withStyles, WithStyles, MenuList, Paper, MenuItem, Box} from '@material-ui/core';
import { ItemList, Menu, Categories, WholeItemList, Ingredient, Tables, AssistanceTables, ListItem, AllStaff, AllItemStats, ItemStats as ItemStatsModel} from './../../../api/models';
import { Client } from './../../../api/client';
import Assistance from './Assistance/AssistanceMain';
import StaffDetails from './StaffDetails/StaffDetails';
import ManageOrders from './Orders/ManageOrders';
import ItemStats from './Analytics/ItemStats';
import {EditMenu} from './Menu/EditMenu';
import {styles} from './styles';

export interface IProps extends WithStyles<typeof styles> { }

interface IState {
    currPage: string,
    queueList: ItemList | null,
    cookingList: ItemList | null,
    readyList: ItemList | null,

    //initialise assist
    tables: Tables | null,
    assistance: Array<number>, 

    //initialise orders
    orderRealData: Array<ListItem>,

    //initialise manage staff
    staffRealData: AllStaff | null,

    //initialise item stats
    itemRealData: Array<ItemStatsModel>,
    trevenue: number,

    //initialise menu
    menu: Menu | null, 
    menuvalue:string,
    currCat:Categories | null,
    allItems: WholeItemList | null,
    ingredientsList: Array<Ingredient> | null,

    //for sorting
    selectedItem: string,
    selectedOrders: string,
    itemSort: string,
    orderSort: string,
}

class Manage extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props);
        this.state = {
            currPage: "Tables",
            queueList: null, //listType === 1
            cookingList: null, //listType === 2
            readyList: null, //listType === 3

            tables: null,
            assistance: [],

            orderRealData: [],

            staffRealData: null,

            itemRealData: [],
            trevenue: 0,

            menu: null,
            menuvalue:'',
            currCat: null,
            allItems: null,
            ingredientsList: null,

            selectedItem: 'itemId',
            selectedOrders: 'status',
            itemSort: 'des',
            orderSort: 'des'
        }
        this.updateAssist = this.updateAssist.bind(this);
        this.updateStaff = this.updateStaff.bind(this);
        this.forceUpdateIngredList = this.forceUpdateIngredList.bind(this);
        this.forceUpdateItemlist = this.forceUpdateItemlist.bind(this);
        this.forceUpdateMenu = this.forceUpdateMenu.bind(this);
        this.changeMenuValue = this.changeMenuValue.bind(this);

        this.changeOrders = this.changeOrders.bind(this);
        this.changeItemStats = this.changeItemStats.bind(this);

        this.changeItemSelected = this.changeItemSelected.bind(this);
        this.changeItemOrder = this.changeItemOrder.bind(this);
        this.changeOrderSelected = this.changeOrderSelected.bind(this);
        this.changeOrderOrder = this.changeOrderOrder.bind(this);
        
    }

    async componentDidMount() {
        const client = new Client();
        const queue: ItemList | null = await client.getListItem(1);
        const cooking: ItemList | null = await client.getListItem(2);
        const ready: ItemList | null = await client.getListItem(3);
        this.setState({
            queueList: queue,
            cookingList: cooking,
            readyList: ready,
        });

        //assistance
        const t: Tables | null = await client.getTables();
        const a: AssistanceTables | null = await client.getAssistanceTable();
        var temp: Array<number> = [];
        if (a?.tables !== undefined) {
            a?.tables.forEach(it => {
                    temp.push(it.table_id);
                }
            )
            this.setState({ assistance: temp });
        }
        this.setState({tables: t});

        //manage orders
        const served: ItemList | null = await client.getListItem(4);
        var temp1: Array<ListItem> = [];
        if (queue?.itemList !== undefined) {
            temp1 = temp1.concat(queue?.itemList);
        }
        if (cooking?.itemList !== undefined) {
            temp1 = temp1.concat(cooking?.itemList);
        }
        if (ready?.itemList !== undefined) {
            temp1 = temp1.concat(ready?.itemList);
        }
        if (served?.itemList !== undefined) {
            temp1 = temp1.concat(served?.itemList);
        }

        this.setState({orderRealData: temp1});

        //manage staff
        const allStaff: AllStaff | null = await client.getStaff();
        this.setState({staffRealData: allStaff});

        //item stats
        const itemStats: AllItemStats | null = await client.getAllStats();
        if (itemStats?.item_sales !== undefined) {
            this.setState({ itemRealData: itemStats?.item_sales });
        }
        if (itemStats?.total_revenue !== undefined) {
            this.setState({ trevenue: itemStats?.total_revenue })
        }

        //menu
        const menu: Menu | null = await client.getMenu();
        if (menu !== null && menu?.menu.length !== undefined) {
            this.setState({
                menu: menu,
                menuvalue: menu?.menu[0].name ? menu?.menu[0].name : "",
                currCat: menu.menu[0],
            });
        }

        const i: WholeItemList | null = await client.getAllItems();
        if (i !== null) {
            this.setState({ allItems: i });
        }
        const ingred: Array<Ingredient> | null = await client.getIngredients();
        this.setState({ ingredientsList: ingred });
    }

    async updateOrders(){
        const client = new Client();
        const queue: ItemList | null = await client.getListItem(1);
        const cooking: ItemList | null = await client.getListItem(2);
        const ready: ItemList | null = await client.getListItem(3);
        const served: ItemList | null = await client.getListItem(4);
        var temp1: Array<ListItem> = [];
        if (queue?.itemList !== undefined) {
            temp1 = temp1.concat(queue?.itemList);
        }
        if (cooking?.itemList !== undefined) {
            temp1 = temp1.concat(cooking?.itemList);
        }
        if (ready?.itemList !== undefined) {
            temp1 = temp1.concat(ready?.itemList);
        }
        if (served?.itemList !== undefined) {
            temp1 = temp1.concat(served?.itemList);
        }
        this.setState({
            orderRealData: temp1,
            queueList: queue,
            cookingList: cooking,
            readyList: ready,
        });

    }

    async updateAssist() {
        const client = new Client();
        const t: Tables | null = await client.getTables();
        const a: AssistanceTables | null = await client.getAssistanceTable();
        var temp: Array<number> = [];
        if (a?.tables !== undefined) {
            a?.tables.forEach(it => {
                temp.push(it.table_id);
            }
            )
            this.setState({ assistance: temp });
        }
        this.setState({ tables: t });
    }

    async forceUpdateMenu() {
        const client = new Client();
        const m: Menu | null = await client.getMenu();
        if (m !== null && m?.menu.length !== undefined) {
            this.setState({
                menu: m,
                menuvalue: m?.menu[0].name ? m?.menu[0].name : "",
                currCat: m.menu[0],
            });
        }
    }

    async forceUpdateItemlist() {
        const client = new Client();
        const i: WholeItemList | null = await client.getAllItems();
        if (i !== null) {
            this.setState({ allItems: i });
        }
    }

    async forceUpdateIngredList() {
        const client = new Client();
        const ingred: Array<Ingredient> | null = await client.getIngredients();
        this.setState({ ingredientsList: ingred });
    }

    async updateStaff(){
        const client = new Client();
        const temp: AllStaff | null = await client.getStaff();
        this.setState({
            staffRealData: temp,
        });
    }

    changeMenuValue(newValue: string) {
        this.setState({ menuvalue: newValue })
    }

    changeItemStats(realData: Array<ItemStatsModel>){
        this.setState({ itemRealData: realData});
    }

    changeOrders(realData: Array<ListItem> ){
        this.setState({ orderRealData: realData});
    }

    changeItemSelected(selected: string){
        this.setState({selectedItem: selected});
    }

    changeItemOrder(order: string){
        this.setState({ itemSort: order });
    }

    changeOrderSelected(selected: string){
        this.setState({ selectedOrders: selected });
    }

    changeOrderOrder(order:string){
        this.setState({ orderSort: order });
    }

    displayCont() {
        const { classes } = this.props;
        if (this.state.currPage === "Orders"){
            return (
                <Box className={classes.staffContainer}>
                    <ManageOrders realData={this.state.orderRealData} changeRealdata={this.changeOrders}
                    changeOrder={this.changeOrderOrder} changeSelected={this.changeOrderSelected}
                    order={this.state.orderSort} selected={this.state.selectedOrders}/>
                </Box>
            );
        } else if (this.state.currPage === "Tables") {
            return (
                <Box className={classes.staffContainer}>
                    <Assistance tables={this.state.tables} assistance={this.state.assistance}
                        update={this.updateAssist}/>
                </Box>
            );
        } else if (this.state.currPage === "Manage"){
            return(
                <Box className={classes.staffContainer}>
                    <StaffDetails realData={this.state.staffRealData} update={this.updateStaff}/>
                </Box>
            );
        } else if (this.state.currPage === "ItemStats") {
            return (
                <Box className={classes.staffContainer}>
                    <ItemStats realData={this.state.itemRealData} trevenue={this.state.trevenue} 
                    setRealdata={this.changeItemStats} setOrder={this.changeItemOrder} order={this.state.itemSort}
                     setSelected={this.changeItemSelected} selected={this.state.selectedItem}/>
                </Box>
            );
        } 
        else {
            return (
                <Box className={classes.menuContainer}>
                    <EditMenu menu={this.state.menu} value={this.state.menuvalue}
                    allItems={this.state.allItems} ingredientsList={this.state.ingredientsList}
                    forceUpdateIngredList={this.forceUpdateIngredList} forceUpdateItemlist={this.forceUpdateItemlist}
                    forceUpdateMenu={this.forceUpdateMenu} changeValue={this.changeMenuValue}/>
                </Box>
            );
        }
    }


    displayNav() {
        return (
            <div className={this.props.classes.root}>
                <Paper className={this.props.classes.menubutton}>
                    <MenuList className={this.props.classes.minSize}>
                        <MenuItem onClick={() => { this.setState({ currPage: "Menu" }) }}>Menu</MenuItem>
                        <MenuItem onClick={() => {this.setState({ currPage: "Orders"})}}>Orders</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Tables" }) }}>Tables</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "Manage" }) }}>Manage</MenuItem>
                        <MenuItem onClick={() => { this.setState({ currPage: "ItemStats" }) }}>Item Statistics</MenuItem>
                    </MenuList>
                </Paper>
            </div>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                {this.displayNav()}
                {this.displayCont()}
            </div>
        );
    }
}

export const ManageStaff = withStyles(styles)(Manage);