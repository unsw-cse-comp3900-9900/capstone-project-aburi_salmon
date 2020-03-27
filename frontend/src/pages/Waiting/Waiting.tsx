import React from "react";
import { withStyles, WithStyles, TableContainer, Paper, TableBody, TableHead, TableRow, TableCell, Table, Button } from '@material-ui/core';

import { styles } from './styles';
import { LeftBox, RightBar } from "../../components";
import { Order as OrderModel } from "../../api/models";
import { Client } from "../../api/client";

interface IProps extends WithStyles<typeof styles> { }

interface IState {
  order: OrderModel | null
}

class WaitingPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      order: null
    }
  }

  async componentDidMount() {
    const client = new Client();
    const o: OrderModel | null = await client.getCurrentOrder();
    this.setState({
      order: o
    });
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
                            <TableCell><Button>Modify</Button></TableCell>
                            <TableCell><Button>Cancel</Button></TableCell>
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
            <div>

            </div>
          }
          second={
            <div>

            </div>
          }
          third={
            <div>

            </div>
          }
        />
      </div>
    )
  }
}

export const Waiting = withStyles(styles)(WaitingPage);
