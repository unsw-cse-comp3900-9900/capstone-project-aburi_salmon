import React from 'react';
import { withStyles, Button, TextField, WithStyles, createStyles } from '@material-ui/core';

import history from '../../history';
import { LeftBox, RightBar } from '../../components';

import { styles } from './styles';

interface IProps extends WithStyles<typeof styles> { }

interface IState {
  value: string;
  allowed: boolean;
}

class TablePage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: 'Select your table number',
      allowed: false
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
              <Button variant="contained" color="primary" onClick={() => this.setTableNumber("1")}>1</Button>
              <Button variant="contained" color="primary" onClick={() => this.setTableNumber("2")}>2</Button>
              <Button variant="contained" color="primary" onClick={() => this.setTableNumber("3")}>3</Button>
            </div>
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
