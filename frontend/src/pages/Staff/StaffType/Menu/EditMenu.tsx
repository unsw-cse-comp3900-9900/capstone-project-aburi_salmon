import React from 'react';
import { Button, withStyles, WithStyles, Modal, Grid, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import EditIcon from '@material-ui/icons/Edit';

import { styles } from './styles';
import { Client } from './../../../../api/client';
import { Menu as MenuModel, Item as ItemModel, Categories as CategoriesModel, Item, WholeItemList, Ingredient } from './../../../../api/models';

import EditCategory from './Components/EditCategory';
import EditItem from './Components/EditItem';
import Delete from './Components/Delete';
import Ingredients from './Components/Ingredients';
import EditIngredients from './Components/EditIngredients';
import AddItemCat from './Components/AddItemCat';
import AlertSnackbar from './../../../AlertSnackbar';

interface IProps extends WithStyles<typeof styles> {
  menu: MenuModel | null;
  value: string;
  allItems: WholeItemList | null,
  ingredientsList: Array<Ingredient> | null,
}

interface IState {
  //displaying menu
  menu: MenuModel | null;
  value: string;
  openModal: boolean;
  modal: ItemModel | null;

  // For editing menu
  editItemDialog: boolean,
  editCatDialog: boolean,
  deleteDialog: boolean,
  ingredDialog: boolean,
  editIngredDialog: boolean,
  addItemCatDialog: boolean,

  currItem: ItemModel,
  currCat: CategoriesModel | null,
  isEdit: boolean, //1 if is edit, 0 if is modify
  isCat: boolean, //1 if is category, 0 if item
  isDel: boolean,
  itemIngredients: Array<number>,
  allItems: WholeItemList | null,
  ingredientsList: Array<Ingredient> | null,

  //alert
  alertDialog: boolean,
  severity: "success" | "info" | "error" | "warning",
  alertMessage: string,

}

class EditMenuPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    var tempmenu = this.props.menu;
    var tempvalue = this.props.value;
    var tempitems = this.props.allItems;
    var tempingred = this.props.ingredientsList;
    var temp: ItemModel = { //for initialisation (don't want to deal with null)
      id: 0,
      name: '',
      description: '',
      ingredients: [],
      price: 0,
      visible: true,
      image_url: '',
    }
    this.state = {
      //displaying menu
      menu: tempmenu,
      value: tempvalue,
      openModal: false,
      modal: null,

      //editing menu
      editItemDialog: false,
      editCatDialog: false,
      deleteDialog: false,
      ingredDialog: false,
      editIngredDialog: false,
      addItemCatDialog: false,

      currItem: temp,
      currCat: null,
      isEdit: false,
      isCat: false,
      isDel: false,
      itemIngredients: [],
      allItems: tempitems,
      ingredientsList: tempingred,

      //alert
      alertDialog: false,
      severity: "error",
      alertMessage: "What???"

    }

    // Displaying menu
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.openModal = this.openModal.bind(this);

    // For editing menu
    this.itemDialogIsOpen = this.itemDialogIsOpen.bind(this);
    this.catDialogIsOpen = this.catDialogIsOpen.bind(this);
    this.deleteDialogIsOpen = this.deleteDialogIsOpen.bind(this);
    this.ingredientDialogIsOpen = this.ingredientDialogIsOpen.bind(this);
    this.editIngredDialogIsOpen = this.editIngredDialogIsOpen.bind(this);
    this.addItemCatIsOpen = this.addItemCatIsOpen.bind(this);
    this.modalIsOpen = this.modalIsOpen.bind(this);

    this.forceUpdateIngredList = this.forceUpdateIngredList.bind(this);
    this.forceUpdateItemlist = this.forceUpdateItemlist.bind(this);
    this.forceUpdateMenu = this.forceUpdateMenu.bind(this);

    //alert
    this.alertDialogIsOpen = this.alertDialogIsOpen.bind(this);
    this.setAlert = this.setAlert.bind(this);
  }

  itemDialogIsOpen(isOpen: boolean) {
    this.setState({ editItemDialog: isOpen });
  }

  catDialogIsOpen(isOpen: boolean) {
    this.setState({ editCatDialog: isOpen });
  }

  deleteDialogIsOpen(isOpen: boolean) {
    this.setState({ deleteDialog: isOpen });
  }

  ingredientDialogIsOpen(isOpen: boolean) {
    this.setState({ ingredDialog: isOpen });
  }

  editIngredDialogIsOpen(isOpen: boolean) {
    this.setState({ editIngredDialog: isOpen });
  }

  addItemCatIsOpen(isOpen: boolean) {
    this.setState({ addItemCatDialog: isOpen });
  }

  modalIsOpen(isOpen: boolean) {
    this.setState({ openModal: isOpen });
  }

  alertDialogIsOpen(isOpen: boolean) {
    this.setState({ alertDialog: isOpen });
  }

  setAlert(isOpen: boolean, severity: "success" | "error", alertMessage: string) {
    this.setState({ alertDialog: isOpen, severity: severity, alertMessage: alertMessage });
  }

  createItemIngredients(item: Item) {
    var temp: Array<number> = [];
    item.ingredients.map(ingred =>
      temp.push(ingred.id)
    );
    this.setState({ itemIngredients: temp });
  }

  generateItemsInCategory(category: CategoriesModel) {
    const { classes } = this.props;
    const categoryName = category.name;
    return (
      <div hidden={this.state.value !== categoryName} id={`tabpanel-${category.id}`} key={category.id} aria-labelledby={`tab-${category.id}`}>
        {
          category.items.map((item, index) => (
            <Card className={classes.itemcard} key={index}>
              <CardContent>
                <Typography variant="h5">
                  {item.name}
                </Typography>
                <Typography variant="body2" component="p">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>

                <div className={classes.wrapper2}>
                  <Button size="small" onClick={() => this.openModal(item)} className={classes.floatLeft}>View item</Button>
                  <Button size="small" className={classes.floatRight} onClick={() => this.setState({ deleteDialog: true, isEdit: false, isCat: false, currItem: item, isDel: false })}
                    color='secondary'>Remove item</Button>
                </div>
              </CardActions>
            </Card>
          ))
        }
      </div>
    )
  }

  handleTabChange(event: React.ChangeEvent<{}>, newValue: string) {
    this.setState({
      value: newValue,
    });
  }

  openModal(item: ItemModel) {
    this.setState({ currItem: item });
    this.createItemIngredients(item);
    this.setState({
      openModal: true,
      modal: item,
    });
  }

  handleCloseModal(event: React.ChangeEvent<{}>) {
    this.setState({
      openModal: false,
    })
  }

  tabProps(index: string) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
      value: `${index}`,
    };
  }

  async forceUpdateMenu() {
    const client = new Client();
    const m: MenuModel | null = await client.getMenu();
    if (m !== null && m?.menu.length !== undefined) {
      this.setState({
        menu: m,
        value: m?.menu[0].name ? m?.menu[0].name : "",
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

  // Component did mount gets called before render
  /*
  async componentDidMount() {
    this.forceUpdateMenu();
    this.forceUpdateItemlist();
    this.forceUpdateIngredList();
  }*/

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.menupage}>
        <EditCategory isOpen={this.state.editCatDialog} setIsOpen={this.catDialogIsOpen} update={this.forceUpdateMenu}
          isEdit={this.state.isEdit} category={this.state.currCat} wholemenu={this.state.menu} alert={this.setAlert} />

        <EditItem isOpen={this.state.editItemDialog} setIsOpen={this.itemDialogIsOpen} wholemenu={this.state.menu}
          isEdit={this.state.isEdit} item={this.state.currItem} updatemenu={this.forceUpdateMenu}
          updateitems={this.forceUpdateItemlist} alert={this.setAlert} />

        <Delete isOpen={this.state.deleteDialog} setIsOpen={this.deleteDialogIsOpen} allItems={this.state.allItems}
          item={this.state.currItem} isDel={this.state.isDel} cat={this.state.currCat} updatemenu={this.forceUpdateMenu}
          updateitems={this.forceUpdateItemlist} alert={this.setAlert} />

        <Ingredients isOpen={this.state.ingredDialog} currItem={this.state.currItem} itemIngredients={this.state.itemIngredients}
          setIsOpen={this.ingredientDialogIsOpen} ingredientsList={this.state.ingredientsList}
          update={this.forceUpdateMenu} setModalIsOpen={this.modalIsOpen} alert={this.setAlert} />

        <EditIngredients isOpen={this.state.editIngredDialog} setIsOpen={this.editIngredDialogIsOpen}
          ingredientsList={this.state.ingredientsList} update={this.forceUpdateIngredList} alert={this.setAlert} />

        <AddItemCat isOpen={this.state.addItemCatDialog} allItems={this.state.allItems} alert={this.setAlert}
          setIsOpen={this.addItemCatIsOpen} wholemenu={this.state.menu} update={this.forceUpdateMenu} />

        <AlertSnackbar isOpen={this.state.alertDialog} severity={this.state.severity} alertMessage={this.state.alertMessage}
          changeState={this.alertDialogIsOpen} />

        <div className={classes.wrapper}>
          <AppBar position="static">
            <Tabs
              value={this.state.value}
              onChange={this.handleTabChange}
              scrollButtons="auto"
              variant="scrollable"

            >
              {
                this.state.menu && this.state.menu?.menu &&
                this.state.menu?.menu.map(category => (
                  <Tab label={<><div>{category.name + " "} <EditIcon onClick={() => this.setState({ editCatDialog: true, isCat: true, isEdit: true, currCat: category })} /></div></>}
                    className={classes.editIcon} key={category.id} {...this.tabProps(category.name)} onClick={() => this.setState({ currCat: category })} />
                ))
              }
            </Tabs>
          </AppBar>
          <div className={classes.overflow}>
            {
              this.state.menu && this.state.menu?.menu &&
              this.state.menu?.menu.map(category => this.generateItemsInCategory(category))
            }
          </div>
        </div>
        <div className={classes.wrapper3}>

          <Button variant='outlined' onClick={() => { this.setState({ editItemDialog: true, isEdit: false, isCat: false }) }}
            className={classes.addFloatRight}>Create Item</Button>

          <Button variant='outlined' onClick={() => { this.setState({ editCatDialog: true, isEdit: false, isCat: true }) }}
            className={classes.addFloatRight}>Add Category</Button>

          <Button variant='outlined' onClick={() => { this.setState({ editIngredDialog: true }) }}
            className={classes.addFloatRight}>Edit Ingredients</Button>

          <Button variant='outlined' onClick={() => { this.setState({ addItemCatDialog: true }) }}
            className={classes.addFloatRight}>Add Item to Category</Button>

          <Button variant='outlined' color='secondary' onClick={() => { this.setState({ deleteDialog: true, isDel: true }) }}
            className={classes.addFloatRight}>Delete Item</Button>

        </div>

        <Modal
          aria-labelledby=""
          aria-describedby=""
          open={this.state.openModal}
          onClose={this.handleCloseModal}
          className={classes.modal}
        >
          <div className={classes.itemmodal}>
            <Grid container spacing={1}>
              {/* First col */}
              <Grid item xs={11}>
                <Typography variant="h4">{this.state.modal?.name}</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton aria-label="close" onClick={this.handleCloseModal}>
                  <Icon>close</Icon>
                </IconButton>
              </Grid>

              {/* Second col */}
              <Grid item xs={8}>
                <div className={classes.imageboxmodaldiv}>
                  <img src={this.state.modal?.image_url} className={classes.imageboxmodal} />
                </div>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">Ingredients</Typography>
                <FormControl>
                  <FormGroup>
                    {
                      this.state.modal && this.state.modal?.ingredients &&
                      this.state.modal?.ingredients.map((ingredient, index) => (<FormControlLabel
                        control={<Checkbox checked={true} />}
                        disabled
                        label={ingredient.name}
                        key={index}
                      />))
                    }
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="subtitle1">{this.state.modal?.description}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1">${this.state.modal?.price.toFixed(2)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Button size="small" variant="outlined" onClick={() => this.setState({ editItemDialog: true, isCat: false, isEdit: true })}>Edit item</Button>
              </Grid>
              <Grid item xs={6}>
                <Button size="small" variant="outlined" onClick={() => this.setState({ ingredDialog: true })}>Edit Ingredients</Button>
              </Grid>

            </Grid>
          </div>
        </Modal>

      </div >
    );
  }
}

export const EditMenu = withStyles(styles)(EditMenuPage);
