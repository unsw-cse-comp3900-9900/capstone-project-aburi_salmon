import React from 'react';
import { withStyles, TextField, WithStyles, createStyles, Modal, Grid, FormControl, FormControlLabel, FormGroup, ButtonBase, Paper, TableBody, TableHead, TableRow, TableCell, Table, TableContainer } from '@material-ui/core';
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

import history from '../../history';
import { LeftBox, RightBar } from '../../components';

import { styles } from './styles';
import { Client } from '../../api/client';
import { Menu as MenuModel, Item as ItemModel, Order as OrderModel, Categories as CategoriesModel, ResponseMessage as ResponseMessageModel, ItemQuantityPair as ItemQuantityPairModel, RecommendationsResult } from '../../api/models';

interface IProps extends WithStyles<typeof styles> { }

interface OrderItemState {
  item: ItemModel;
  quantity: number;
  comment: string;
}

interface IState {
  menu: MenuModel | null;
  value: string;
  openModal: boolean;

  // For modal inside this component
  modal: ItemModel | null;
  modalQuantity: number;
  modalOriginalQuantity: number;
  modalComment: string;

  // For list of items that user wants to order
  orders: Array<OrderItemState>;

  // For second button of the order
  modalSecondButton: string;
  modalSecondButtonDisable: boolean;

  openConfirmModal: boolean;

}

class MenuPage extends React.Component<IProps, IState> {
  private recommended: Array<number>;
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
      modalComment: "",
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
    this.recommended = new Array<number>();
  }

  generateItemsInCategory(category: CategoriesModel) {
    const { classes } = this.props;
    const categoryName = category.name;
    return (
      <div hidden={this.state.value !== categoryName} id={`tabpanel-${category.id}`} key={category.id} aria-labelledby={`tab-${category.id}`}>
        {
          category.items.map(item => {
            const recommended = categoryName === "Recommended" ? true : false;
            return (
            // If there is an item with multiple categories, this will break.
            <Card className={classes.itemcard} key={`${category.id}-${item.id}`}>
              <CardContent>
                <Typography variant="h5">
                  {item.name}
                </Typography>
                <Typography variant="body2" component="p">
                  {item.description}
                </Typography>
                {
                  recommended && <Typography variant="body2" component="p">This item is recommended for you</Typography>
                }
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => this.openModal(item)}>Add item</Button>
              </CardActions>
            </Card>
          )
        })
        }
      </div>
    )
  }

  async goBack() {
    // Check current order. if empty, logout and go to table
    const client = new Client();
    const o: OrderModel | null = await client.getCurrentOrder();

    if (o && o?.item_order.length !== 0) {
      history.push('/waiting');
    } else {
      const r = await client.customerLogout();
      if (r) history.push('/table');
    }
  }

  handleTabChange(event: React.ChangeEvent<{}>, newValue: string) {
    this.setState({
      value: newValue,
    });
  }

  openModal(item: ItemModel) {
    let quantity = 0;
    let comment = "";

    this.state.orders.forEach((it: OrderItemState) => {
      if (it.item.id === item.id) {
        quantity = it.quantity;
        comment = it.comment;
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
      modalComment: comment,

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

  modifyModalComment(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.setState({
      modalComment: event.target.value,
      modalSecondButtonDisable: false
    });
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

  async addToOrder(event: React.ChangeEvent<{}>) {
    const item = this.state.modal!;
    const quantity = this.state.modalQuantity;
    const comment = this.state.modalComment;
    console.log(quantity);
    const r: OrderItemState = {
      item: item,
      quantity: quantity,
      comment: comment,
    }

    let orders = this.state.orders;
    orders = orders.filter(x => x.item.id !== item.id);
    if (quantity !== 0) {
      orders.push(r);
    }

    const orderid: Array<number> = [];
    orders.forEach(it => {
      orderid.push(it.item.id);
    });

    const c = new Client();
    const rec: RecommendationsResult | null = await c.getRecommendations(orderid);

    if (rec) {
      this.recommended = new Array<number>();
      rec.recommendations.forEach(it => {
        this.recommended.push(it.item_id);
      });

      this.setState(prevState => {
        const nm = prevState.menu!;

        if (nm?.menu[0].name !== "Recommended") {
          const nc = {
            id: -1,
            name: "Recommended",
            position: -1,
            items: new Array<ItemModel>(),
          };
          nm?.menu.unshift(nc);
        }
        // Refresh element every single time
        nm.menu[0].items = new Array<ItemModel>();
        prevState.menu?.menu.map(cats => {
          cats.items.map(it => {
            if (this.recommended.findIndex((e) => e === it.id) !== -1) {
              nm.menu[0].items.push(it);
            }
          })
        })

        return {menu: nm};
      });
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
    let s: Array<ItemQuantityPairModel> = [];
    this.state.orders?.forEach((it) => {
      const t: ItemQuantityPairModel = {
        item_id: it.item.id,
        quantity: it.quantity,
        comment: it.comment,
      };
      s.push(t);
    });

    const client = new Client();
    const m: ResponseMessageModel | null = await client.createOrder(s);

    if (m) {
      history.push('/waiting');
    }
  }

  // Component did mount gets called before render
  async componentDidMount() {
    const client = new Client();
    const [m, o] = await Promise.all([client.getMenu(), client.getCurrentOrder()]);

    // Comment if statement below if recommendation needs to be disabled before adding 
    // item to the queue
    if (o?.item_order.length !== 0) {
      const nc = {
        id: -1,
        name: "Recommended",
        position: -1,
        items: new Array<ItemModel>(),
      };
      m?.menu.unshift(nc);

      const itemid = o?.item_order.map(it => it.item_id);
      const rec: RecommendationsResult | null = await client.getRecommendations(itemid!);

      this.recommended = new Array<number>();
      rec?.recommendations.forEach(it => {
        this.recommended.push(it.item_id);
      });

      m?.menu.map(cats => {
        cats.items.map(it => {
          if (this.recommended.findIndex((e) => e === it.id) !== -1) {
            m.menu[0].items.push(it);
          }
        })
      })
    }


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
        <LeftBox
          first={
            <div className={classes.title}>
              Select item
            </div>
          }
          second={
            <div style={{ maxHeight: '100%', overflow: 'auto' }}>
              <AppBar position="static">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleTabChange}
                >
                  {
                    this.state.menu && this.state.menu?.menu &&
                    this.state.menu?.menu.map(category => (
                      <Tab label={category.name} key={category.id} {...this.tabProps(category.name)} />
                    ))
                  }
                </Tabs>
              </AppBar>
              {
                this.state.menu && this.state.menu?.menu &&
                this.state.menu?.menu.map(category => this.generateItemsInCategory(category))
              }
            </div>
          }
        />

        <RightBar
          first={
            <div>
              <Button className={classes.assistancebutton} variant="contained" color="primary">Help</Button>
              <Button className={classes.gobackbutton} variant="contained" color="secondary" onClick={() => this.goBack()}>Go back</Button>
            </div>
          }
          second={
            <div className={classes.itemlists}>
              {
                this.state.orders.map((order: OrderItemState) => {
                  return (
                    <ButtonBase
                      className={classes.cardaction}
                      onClick={() => this.openModal(order.item)}
                    >
                      <Card className={classes.itemcard}>
                        <CardContent>
                          <Typography variant="h5">
                            {order.item.name}
                          </Typography>
                          <Typography variant="body2" component="p">
                            ${order.item.price} x {order.quantity} = <b>${order.item.price * order.quantity}</b>
                          </Typography>
                          <Typography variant="body2" component="p">
                            {order.comment}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ButtonBase>
                  );
                })
              }
            </div>
          }
          third={
            <div>
              <Typography variant="h6">Total price: ${this.calculateTotalPrice()}</Typography>
              <Button variant="contained" color="primary" disabled={this.state.orders.length === 0} onClick={() => this.openConfirmModal()}>
                Confirm order
              </Button>
            </div>
          }
        />

        {/* First modal for items */}
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
                      this.state.modal?.ingredients.map(ingredient => (<FormControlLabel
                        control={<Checkbox checked={true} />}
                        disabled
                        label={ingredient.name}
                      />))
                    }
                  </FormGroup>
                </FormControl>
              </Grid>

              {/* Third col */}
              <Grid item xs={8}>
                <Typography variant="subtitle1">{this.state.modal?.description}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1">$ {this.state.modal?.price.toString()}</Typography>
                <Typography variant="subtitle1">Quantity</Typography>
                <IconButton aria-label="remove" disabled={this.state.modalQuantity <= 0} onClick={() => this.removeModalQuantity()}>
                  <Icon>remove_circle</Icon>
                </IconButton>
                {this.state.modalQuantity}
                <IconButton aria-label="add" onClick={() => this.addModalQuantity()}>
                  <Icon>add_circle</Icon>
                </IconButton>
              </Grid>

              {/* Last col */}
              <Grid item xs={7}>
                <TextField id="standard-basic" label="Comment" onChange={(e) => this.modifyModalComment(e)} defaultValue={this.state.modalComment} />
              </Grid>
              <Grid item xs={5}>
                <Button variant="contained" onClick={this.handleCloseModal}>Cancel</Button>
                <Button variant="contained" color="primary" disabled={this.state.modalSecondButtonDisable} onClick={this.addToOrder}>{this.state.modalSecondButton}</Button>
              </Grid>
            </Grid>
          </div>
        </Modal>

        {/* Second modal for confirmation */}
        <Modal
          aria-labelledby=""
          aria-describedby=""
          open={this.state.openConfirmModal}
          onClose={this.handleCloseConfirmModal}
          className={classes.modal}
        >
          <div className={classes.confirmmodal}>
            <Grid container spacing={1}>
              <Grid item xs={11}>
                <Typography variant="h4">Order summary</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton aria-label="close" onClick={this.handleCloseConfirmModal}>
                  <Icon>close</Icon>
                </IconButton>
              </Grid>

              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Quantity x Price</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Comment</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        this.state.orders &&
                        this.state.orders?.map((it: OrderItemState) => {
                          return (
                            <TableRow>
                              <TableCell>{it.item.name}</TableCell>
                              <TableCell>{it.item.price} x {it.quantity}</TableCell>
                              <TableCell>{it.quantity * it.item.price}</TableCell>
                              <TableCell>{it.comment}</TableCell>
                            </TableRow>
                          )
                        })
                      }
                      <TableRow>
                        <TableCell />
                        <TableCell><b>Total Price</b></TableCell>
                        <TableCell><b>${this.calculateTotalPrice()}</b></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={6} />
              <Grid item xs={3}>
                <Button variant="contained" onClick={this.handleCloseConfirmModal}>Cancel</Button>
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" color="primary" onClick={() => this.submitOrder()}>Submit Order</Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div >
    );
  }
}

export const Menu = withStyles(styles)(MenuPage);
