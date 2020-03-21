import React from 'react';
import { withStyles, Button, TextField, WithStyles, createStyles } from '@material-ui/core';

import history from '../../history';
import { LeftBox, RightBar } from '../../components';

import { styles } from './styles';
import { Client } from '../../api/client';
import { Tables } from '../../api/models';

interface IProps extends WithStyles<typeof styles> { }

interface IState {
  value: string;
  allowed: boolean;
  tables: Tables | null;
}

class TablePage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: 'Select your table number',
      allowed: false,
      tables: null
    }
  }

  goToMain() {
    history.push("/");
  }

  setTableNumber(tableNumber: string) {
    this.setState({
      value: tableNumber,
      allowed: true
    });
  }

  goToOrder() {
    history.push('/menu');
  }

  async componentDidMount() {
    const client = new Client()
    const t: Tables | null = await client.getTables();
    this.setState({ tables: t });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.tablepage}>
        <LeftBox
          first={
            <div className={classes.title}>
              Select table
            </div>
          }
          second={
            this.state.tables?.tables.map(tbl => (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => this.setTableNumber(tbl.table_id.toString())} disabled={tbl.occupied}
              >
                {tbl.table_id}
              </Button>
            ))
            // <div>
            //   <Button variant="contained" color="primary" onClick={() => this.setTableNumber("1")}>1</Button>
            //   <Button variant="contained" color="primary" onClick={() => this.setTableNumber("2")}>2</Button>
            //   <Button variant="contained" color="primary" onClick={() => this.setTableNumber("3")}>3</Button>
            // </div>
          }
        />

        <RightBar
          first={
            <Button variant="contained" color="secondary" onClick={() => this.goToMain()}>Go back</Button>
          }
          second={
            <TextField
              id="outlined-read-only-input"
              label="Table number"
              value={this.state.value}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          }
          third={
            <Button variant="contained" disabled={!this.state.allowed} onClick={() => this.goToOrder()}>
              Go to next page
          </Button>
          }
        />
      </div >
    );
  }
}

export const Table = withStyles(styles)(TablePage);
