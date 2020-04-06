import React from 'react';
import { withStyles, WithStyles, Modal, Grid, FormControl, FormControlLabel, FormGroup} from '@material-ui/core';
import Button from '@material-ui/core/Button';
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

import history from '../../../history';

import { styles } from './styles';
import { Client } from '../../../api/client';
import { Menu as MenuModel, Item as ItemModel, Categories as CategoriesModel } from '../../../api/models';

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
}

class StaticMenuPage extends React.Component<IProps, IState> {
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
    }
    // To bind the tab change
    this.handleTabChange = this.handleTabChange.bind(this);

    // To bind with modal change
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.openModal = this.openModal.bind(this);

    // To bind with quantity
    this.addToOrder = this.addToOrder.bind(this);

    this.handleCloseConfirmModal = this.handleCloseConfirmModal.bind(this);
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
                <Button size="small" onClick={() => this.openModal(item)}>View item</Button>
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

  addToOrder(event: React.ChangeEvent<{}>) {
    const item = this.state.modal!;
    const quantity = this.state.modalQuantity;
    console.log(quantity);
    const r: OrderItemState = {
      item: item,
      quantity: quantity,
    }

    let orders = this.state.orders;
    orders = orders.filter(x => x.item.id !== item.id);
    if (quantity !== 0) {
      orders.push(r);
    }
    this.setState({
      openModal: false,
      orders: orders,
    })
  }

  tabProps(index: string) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
      value: `${index}`,
    };
  }

  calculateTotalPrice() {
    let p = 0;
    this.state.orders.forEach(it => {
      p += (it.item.price * it.quantity);
    });
    return p;
  }

  async submitOrder() {

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
                      <Tab label={category.name} key={category.id} {...this.tabProps(category.name)} />
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
                      this.state.modal?.ingredients.map(ingredient => (<FormControlLabel
                        control={<Checkbox checked={true} />}
                        disabled
                        label={ingredient.name}
                      />))
                    }
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="subtitle1">{this.state.modal?.description}</Typography>
              </Grid>
            </Grid>
          </div>
        </Modal>

      </div >
    );
  }
}

export const StaticMenu = withStyles(styles)(StaticMenuPage);
