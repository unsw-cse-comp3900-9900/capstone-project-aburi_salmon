import React from "react";
import { withStyles, WithStyles, TableContainer, Paper, TableBody, TableHead, TableRow, TableCell, Table, Button, Modal, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';

import history from '../../history';
import { styles } from './styles';
import { LeftBox, RightBar } from "../../components";
import { Order as OrderModel, ItemOrder as ItemOrderModel, Item } from "../../api/models";
import { Client } from "../../api/client";
import { Item as ItemModel, ItemQuantityPair as ItemQuantityPairModel, OrderItemQuantityPair as OrderItemQuantityPairModel, ResponseMessage as ResponseMessageModel } from '../../api/models';

// I don't care. Socketio client should be separated instead of all together in one
import io from 'socket.io-client';

interface IProps extends WithStyles<typeof styles> { }

interface IState {
  order: OrderModel | null;
  openModal: boolean;
  modal: ItemModel | null;
  modal_item_order: ItemOrderModel | null;
  modalQuantity: number;
  modalComment: string;
  modalOriginalQuantity: number;
  modalSecondButtonDisable: boolean;
  disableBill: boolean;
  billButton: string;
  addItemButtonDisabled: boolean;
  assistanceButtonDisabled: boolean;
}

class WaitingPage extends React.Component<IProps, IState> {
  private socket: SocketIOClient.Socket;
  constructor(props: IProps) {
    super(props);
    this.state = {
      order: null,
      openModal: false,
      modal: null,
      modal_item_order: null,
      modalQuantity: 0,
      modalComment: "",
      modalOriginalQuantity: 0,
      modalSecondButtonDisable: true,
      disableBill: true,
      billButton: "Pay bill",
      addItemButtonDisabled: false,
      assistanceButtonDisabled: true,
    }
    this.openModal = this.openModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.addToOrder = this.addToOrder.bind(this);

    this.socket = io('http://localhost:5000');
    this.listen();
  }

  async listen() {
    const socket = this.socket;

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('join');
      this.setState({
        assistanceButtonDisabled: false
      });
    });
    socket.on('join', ({ room }: {room: string}) => {
      console.log(`Joined room ${room}`);
    });
    socket.on('cooking', async () => {
      await this.updateOrders()
    });
    socket.on('ready', async () => {
      await this.updateOrders()
    });
    socket.on('served', async () => {
      await this.updateOrders()
    });
  }

  renderFirstButton(it: ItemOrderModel) {
    if (it.status.id === 1) {
      return (<Button color="primary" onClick={() => this.openModal(it)}>Modify order</Button>);
    }
    return (<Button disabled color="primary">Modify order</Button>);
  }

  async openModal(it: ItemOrderModel) {
    const client = new Client();
    const i: ItemModel | null = await client.getItem(it.item_id);

    const mq = it.quantity;
    this.setState({
      openModal: true,
      modal: i,
      modal_item_order: it,
      modalQuantity: mq,
      modalOriginalQuantity: mq,
      modalSecondButtonDisable: true,
    });
  }

  removeModalQuantity() {
    this.setState(prevState => {
      let pq = prevState.modalQuantity;
      if (pq <= 2) pq = 1;
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

  async addToOrder(event: React.ChangeEvent<{}>) {
    const client = new Client();
    let r: ResponseMessageModel | null = null;
    if (this.state.modal_item_order?.status.id === 1) {
      // Submit item_order_id to patch or delete
      if (this.state.modalQuantity === 0) {
        // Delete order
        r = await client.deleteItemOrder(this.state.modal_item_order.id);
      } else {
        // Patch order
        r = await client.patchItemOrder(this.state.modal_item_order.id, this.state.modalQuantity, this.state.modalComment);
      }
    }

    const o: OrderModel | null = await client.getCurrentOrder();

    // Doesn't matter if null
    this.setState({
      openModal: false,
      order: o,
    });
  }

  async cancelOrder(it: ItemOrderModel) {
    const client = new Client();

    const r: ResponseMessageModel | null = await client.deleteItemOrder(it.id);

    const o: OrderModel | null = await client.getCurrentOrder();

    // Doesn't matter if null
    this.setState({
      openModal: false,
      order: o,
    });
  }

  async payBill() {
    const client = new Client();

    const r: ResponseMessageModel | null = await client.requestBill();

    if (r) {
      this.setState({
        disableBill: true,
        billButton: "Bill has been requested",
      })
    }
  }

  async updateOrders() {
    const client = new Client();
    const o: OrderModel | null = await client.getCurrentOrder();

    // Doesn't matter if null
    let disableBillButton: boolean = false;

    o?.item_order.forEach((it) => {
      if (it.status.id !== 4) {
        disableBillButton = true;
      }
    })

    let billButtonString: string = "Pay bill";
    let addItemButtonDisabled: boolean = false;

    if (o?.bill_request === true) {
      disableBillButton = true;
      billButtonString = "Bill has been requested";
      addItemButtonDisabled = true;
    }

    this.setState({
      order: o,
      disableBill: disableBillButton,
      billButton: billButtonString,
      addItemButtonDisabled: addItemButtonDisabled,
    });
  }

  async componentDidMount() {
    await this.updateOrders();
  }

  // This will be called when there is a state change
  componentDidUpdate() {
    
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.waitingpage}>
        <LeftBox
          first={
            <div className={classes.title}>
              Your orders
            </div>
          }
          second={
            <div>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Quantity x Price</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.order && this.state.order?.item_order &&
                      this.state.order?.item_order.map((it) => {
                        return (
                          <TableRow>
                            <TableCell>{it.item}</TableCell>
                            <TableCell>{it.quantity} x {it.price}</TableCell>
                            <TableCell>{it.quantity * it.price}</TableCell>
                            <TableCell>{it.status.name}</TableCell>
                            <TableCell>{this.renderFirstButton(it)}</TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          }
        />
        <RightBar
          first={
            <div className={classes.rightdiv}>
              <Button className={classes.assistancebutton} variant="contained" color="primary" disabled={this.state.assistanceButtonDisabled}>Request assistance</Button>
              <Button className={classes.additembutton} variant="contained" color="primary" disabled={this.state.addItemButtonDisabled} onClick={() => history.push('/menu')}>Add item to order</Button>
            </div>
          }
          second={
            <div className={classes.rightdiv}>
            </div>
          }
          third={
            <div className={classes.rightdiv}>
              <Button className={classes.paybillbutton} variant="contained" color="primary" disabled={this.state.disableBill} onClick={() => this.payBill()}>{this.state.billButton}</Button>
            </div>
          }
        />

        <Modal
          open={this.state.openModal}
          onClose={this.handleCloseModal}
          className={classes.modal}
        >
          <div className={classes.itemmodal}>
            <Grid container spacing={2}>
              <Grid item xs={11}>
                {/* Nothing */}
              </Grid>
              <Grid item xs={1}>
                <IconButton aria-label="add" onClick={this.handleCloseModal}>
                  <Icon>close</Icon>
                </IconButton>
              </Grid>
              {/* First col */}
              <Grid item xs={8}>
                <Typography variant="h4">{this.state.modal?.name}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">Ingredients</Typography>
              </Grid>

              {/* Second col */}
              <Grid item xs={8}>
                <div className={classes.imageboxmodaldiv}>
                  <img src={this.state.modal?.image_url} className={classes.imageboxmodal} />
                </div>
              </Grid>
              <Grid item xs={4}>
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
                <IconButton aria-label="remove" disabled={this.state.modalQuantity <= 1} onClick={() => this.removeModalQuantity()}>
                  <Icon>remove_circle</Icon>
                </IconButton>
                {this.state.modalQuantity}
                <IconButton aria-label="add" onClick={() => this.addModalQuantity()}>
                  <Icon>add_circle</Icon>
                </IconButton>
              </Grid>

              {/* Last col */}
              <Grid item xs={6}>
                {/* nothing here */}
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" onClick={this.handleCloseModal}>Cancel</Button>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="secondary" onClick={() => this.cancelOrder(this.state.modal_item_order!)}>Cancel Order</Button>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" disabled={this.state.modalSecondButtonDisable} onClick={this.addToOrder}>Modify Order</Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
    )
  }
}

export const Waiting = withStyles(styles)(WaitingPage);
