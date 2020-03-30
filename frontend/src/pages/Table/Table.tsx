import React from 'react';
import { withStyles, Button, TextField, WithStyles, createStyles } from '@material-ui/core';

import history from '../../history';
import { LeftBox, RightBar } from '../../components';

import { styles } from './styles';
import { Client } from '../../api/client';
import { Tables as TableModel } from '../../api/models';

const client = new Client();

interface IProps extends WithStyles<typeof styles> { }

interface IState {
  value: string;
  allowed: boolean;
  tables: TableModel | null;
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

  async goToOrder(table_id: number) {
    await client.selectTable(table_id)
    history.push('/menu');
  }

  // Component did mount gets called before render
  async componentDidMount() {
    const t: TableModel | null = await client.getTables();

    // Doesn't matter if null
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
            <div>
              {
                this.state.tables?.tables.map(tbl => (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.tablebutton}
                    onClick={() => this.setTableNumber(tbl.table_id.toString())} disabled={tbl.occupied}
                  >
                    {tbl.table_id}
                  </Button>
                ))
              }
            </div>
          }
        />

        <RightBar
          first={
            <Button className={classes.gobackbutton} variant="contained" color="secondary" onClick={() => this.goToMain()}>Go back</Button>
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
            <Button className={classes.gotonextpagebutton} variant="contained" disabled={!this.state.allowed} onClick={() => this.goToOrder(parseInt(this.state.value))}>
              Go to next page
          </Button>
          }
        />
      </div >
    );
  }
}

export const Table = withStyles(styles)(TablePage);
