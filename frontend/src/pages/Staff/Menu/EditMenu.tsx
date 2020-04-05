import React from 'react';
import { Button,withStyles, TextField, WithStyles, createStyles, Modal, Grid, FormControl, FormControlLabel, FormGroup, ButtonBase, Paper, TableBody, TableHead, TableRow, TableCell, Table, TableContainer } from '@material-ui/core';
//import Button from '@material-ui/core/Button';
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

import history from '../../../history';

import { styles } from './styles';
import { Client } from '../../../api/client';
import { Menu as MenuModel, Item as ItemModel, Categories as CategoriesModel } from '../../../api/models';

import EditCategory from './EditCategory';
import EditItem from './EditItem';
import Delete from './Delete';



interface IProps extends WithStyles<typeof styles> { }

interface OrderItemState {
  item: ItemModel;
  quantity: number;
}

interface OrderState {
  items: Array<OrderItemState>;
}

interface IState {
  menu: MenuModel | null;
  value: string;
  openModal: boolean;

  // For modal inside this component
  modal: ItemModel | null;
  modalQuantity: number;
  modalOriginalQuantity: number;

  // For list of items that user wants to order
  orders: Array<OrderItemState>;

  // For second button of the order
  modalSecondButton: string;
  modalSecondButtonDisable: boolean;

  openConfirmModal: boolean;

  // For editing menu
  editItemDialog: boolean,
  editCatDialog: boolean,
  deleteDialog: boolean,
  currItem: string,
  currCat: string,
  isEdit: boolean, //1 if is edit, 0 if is modify
  isCat: boolean, //1 if is category, 0 if item
}

class EditMenuPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      // If menu is null, then nothing will be generated
      menu: null,
      // Even if initial value is an empty string, componentDidMount will fill in according to the first item on cats array
      value: "",
      openModal: false,
      modal: null,
      modalQuantity: 0,
      modalOriginalQuantity: 0,
      orders: new Array<OrderItemState>(),
      modalSecondButton: "Add to order",
      modalSecondButtonDisable: true,
      openConfirmModal: false,

      //editing menu
      editItemDialog: false,
      editCatDialog: false,
      deleteDialog: false,
      currItem: '',
      currCat: '',
      isEdit: false,
      isCat: false,

    }
    // To bind the tab change
    this.handleTabChange = this.handleTabChange.bind(this);

    // To bind with modal change
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.openModal = this.openModal.bind(this);


    this.handleCloseConfirmModal = this.handleCloseConfirmModal.bind(this);

    // For editing menu
    this.itemDialogIsOpen = this.itemDialogIsOpen.bind(this);
    this.catDialogIsOpen = this.catDialogIsOpen.bind(this);
    this.deleteDialogIsOpen = this.deleteDialogIsOpen.bind(this);
    this.addItem = this.addItem.bind(this);
    this.addCat = this.addCat.bind(this);
    this.doNothing = this.doNothing.bind(this);
  }

  itemDialogIsOpen(isOpen: boolean){
    this.setState({editItemDialog: isOpen});
  }

  catDialogIsOpen(isOpen: boolean){
    this.setState({ editCatDialog: isOpen });
  }

  deleteDialogIsOpen(isOpen: boolean){
    this.setState({ deleteDialog: isOpen });
  }

  addItem(){
    console.log('Adding item');
  }

  addCat(categoryName: string){
    console.log(categoryName);
  }

  doNothing(){
    console.log('Doing nothing');
  }


  generateItemsInCategory(category: CategoriesModel) {
    const { classes } = this.props;
    const categoryName = category.name;
    return (
      <div hidden={this.state.value !== categoryName} id={`tabpanel-${category.id}`} key={category.id} aria-labelledby={`tab-${category.id}`}>
        {
          category.items.map(item => (
            // If there is an item with multiple categories, this will break.
            <Card className={classes.itemcard} key={`${category.id}-${item.id}`}>
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
                  <Button size="small"  className={classes.floatRight} onClick={()=>this.setState({deleteDialog: true, isEdit: false, isCat: false})} 
                  color='secondary'>Delete item</Button>
                </div>
              </CardActions>
            </Card>
          ))
        }
      </div>
    )
  }

  goToTable() {
    history.push('/table');
  }

  handleTabChange(event: React.ChangeEvent<{}>, newValue: string) {
    this.setState({
      value: newValue,
    });
  }

  openModal(item: ItemModel) {
    let quantity = 0;

    this.state.orders.forEach((it: OrderItemState) => {
      if (it.item.id === item.id) {
        quantity = it.quantity;
      }
    })

    this.setState({
      openModal: true,

      // Note: always pass in the whole ModalState object when setting new state on open modal. It will break if you're not passing the whole object
      // Read https://stackoverflow.com/questions/49348996/react-change-a-json-object-in-setstate
      modal: item,

      // Set quantity to 0 for new item. Might need to change this if entry exists
      modalQuantity: quantity,
      modalOriginalQuantity: quantity,

      // Set second button to modify order if quantity is not 0
      modalSecondButton: quantity === 0 ? "Add to order" : "Modify order",
      modalSecondButtonDisable: true,
    });
  }

  openConfirmModal() {
    this.setState({ openConfirmModal: true });
  }

  removeModalQuantity() {
    this.setState(prevState => {
      let pq = prevState.modalQuantity;
      if (pq <= 1) pq = 0;
      else pq--;
      return {
        modalQuantity: pq,
        modalSecondButtonDisable: pq === prevState.modalOriginalQuantity,
      }
    });
  }

  addModalQuantity() {
    this.setState(prevState => {
      let pq = this.state.modalQuantity + 1;
      return {
        modalQuantity: pq,
        modalSecondButtonDisable: pq === prevState.modalOriginalQuantity,
      }
    })
  }

  handleCloseModal(event: React.ChangeEvent<{}>) {
    this.setState({
      openModal: false,
    })
  }

  handleCloseConfirmModal(event: React.ChangeEvent<{}>) {
    this.setState({
      openConfirmModal: false,
    })
  }

  tabProps(index: string) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
      value: `${index}`,
    };
  }

  // Component did mount gets called before render
  async componentDidMount() {
    const client = new Client();
    const m: MenuModel | null = await client.getMenu();
    this.setState({
      menu: m,
      value: m?.menu[0].name ? m?.menu[0].name : "",
    });
  }

  // This will be called when there is a state change
  componentDidUpdate() {

  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.menupage}>
        <EditCategory isOpen={this.state.editCatDialog} setIsOpen={this.catDialogIsOpen}
          relevantFunction={this.addCat} isEdit={this.state.isEdit} name={this.state.currItem}/>
        <EditItem isOpen={this.state.editItemDialog} setIsOpen={this.itemDialogIsOpen}
          relevantFunction={this.addItem} isEdit={this.state.isEdit} itemname={this.state.currItem}/>
        <Delete isOpen={this.state.deleteDialog} setIsOpen={this.deleteDialogIsOpen}
          relevantFunction={this.doNothing} itemname={this.state.currItem} isCat={this.state.isCat}/>
            <div className={classes.wrapper}>
              <AppBar position="static">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleTabChange}
                >
                  {
                    this.state.menu && this.state.menu?.menu &&
                    this.state.menu?.menu.map(category => (
                      <Tab label={<><div>{category.name + " "} <EditIcon onClick={() => this.setState({editCatDialog: true, isCat:true, isEdit:true})} /></div></>} 
                      className={classes.editIcon} key={category.id} {...this.tabProps(category.name)} />
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
          <Button variant='outlined' color='primary' onClick={() => { this.setState({ editItemDialog: true, isEdit:false, isCat: false})}}
              className={classes.addFloatRight}>Add Item</Button>
          <Button variant='outlined' color='primary' onClick={() => { this.setState({ editCatDialog: true, isEdit:false, isCat:true }) }}
               className={classes.addFloatRight}>Add Category</Button>
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
                insert image here
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
                <Button size="small" variant="outlined" onClick={() => this.setState({ editItemDialog: true, isCat:false, isEdit: true})}>Edit item</Button>
              </Grid>
            </Grid>
          </div>
        </Modal>

      </div >
    );
  }
}

export const EditMenu = withStyles(styles)(EditMenuPage);
