import React from "react";
import { withStyles, WithStyles, TableContainer, Paper, TableBody, TableHead, TableRow, TableCell, Table, Button, Modal, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';

import { styles } from './styles';
import { LeftBox, RightBar } from "../../components";
import { Order as OrderModel, ItemOrder as ItemOrderModel, Item } from "../../api/models";
import { Client } from "../../api/client";
import { Item as ItemModel } from '../../api/models';

interface IProps extends WithStyles<typeof styles> { }

interface IState {
  order: OrderModel | null;
  openModal: boolean;
  modal: ItemModel | null;
  modalQuantity: number;
  modalOriginalQuantity: number;
  modalSecondButton: string;
  modalSecondButtonDisable: boolean;
}

class WaitingPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      order: null,
      openModal: false,
      modal: null,
      modalQuantity: 0,
      modalOriginalQuantity: 0,
      modalSecondButton: "Add to order",
      modalSecondButtonDisable: true,
    }
    this.openModal = this.openModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
  }

  renderFirstButton(it: ItemOrderModel) {
    switch (it.status.id) {
      case 1:
        return (<Button color="primary" onClick={() => this.openModal(it)}>Modify order</Button>);
      case 3:
        return (<Button color="primary" onClick={() => this.openModal(it)}>Add more</Button>)
      default:
        return (<Button disabled color="primary">Modify order</Button>);
    }
  }

  renderSecondButton(it: ItemOrderModel) {
    if (it.status.id === 0) {
      return (<Button color="secondary">Cancel</Button>);
    }
    return (<Button disabled color="secondary">Cancel</Button>);
  }

  async openModal(it: ItemOrderModel) {
    const client = new Client();
    const i: ItemModel | null = await client.getItem(it.item_id);

    const mq = it.status.id === 1 ? it.quantity : 0;

    this.setState({
      openModal: true,
      modal: i,
      modalQuantity: mq,
      modalOriginalQuantity: mq,
      modalSecondButtonDisable: true,
    });
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

  async addToOrder(event: React.ChangeEvent<{}>) {

    this.setState({
      openModal: false,
    })
  }

  async componentDidMount() {
    const client = new Client();
    const o: OrderModel | null = await client.getCurrentOrder();

    // If falsy, don't set state
    if (!o) {
      this.setState({
        order: o
      });
    }
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
                    {
                      this.state.order?.item_order.map((it) => {
                        return (
                          <TableRow>
                            <TableCell>{it.item}</TableCell>
                            <TableCell>{it.quantity} x {it.price}</TableCell>
                            <TableCell>{it.quantity * it.price}</TableCell>
                            <TableCell>{it.status.name}</TableCell>
                            <TableCell>{this.renderFirstButton(it)}</TableCell>
                            <TableCell><Button disabled={it.status.id > 0}>Cancel</Button></TableCell>
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
              <Button variant="contained" color="primary">Request assistance</Button>
              <Button variant="contained" color="primary">Add item to order</Button>
            </div>
          }
          second={
            <div className={classes.rightdiv}>

            </div>
          }
          third={
            <div className={classes.rightdiv}>
              <Button variant="contained" color="primary" disabled>Bill Unpaid</Button>
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
                insert image here
                    </Grid>
              <Grid item xs={4}>
                <FormControl>
                  <FormGroup>
                    {
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
                {/* nothing here */}
              </Grid>
              <Grid item xs={5}>
                <Button variant="contained" onClick={this.handleCloseModal}>Cancel</Button>
                <Button variant="contained" color="primary" disabled={this.state.modalSecondButtonDisable} onClick={this.addToOrder}>{this.state.modalSecondButton}</Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
    )
  }
}

export const Waiting = withStyles(styles)(WaitingPage);
