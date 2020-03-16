import React from 'react';
import { withStyles, Button, TextField } from '@material-ui/core';

import history from './../../history';
import { LeftBox, RightBar } from './../../components';
import { styles } from './styles';

class TablePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Select your table number',
      allowed: false
    }
  }

  goToMain() {
    history.push("/");
  }

  setTableNumber(tableNumber) {
    this.setState({
      value: tableNumber,
      allowed: true
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.tablepage}>
        <LeftBox>
          {/* Dummy divs, do not use this for LeftBox 
          hardcoded buttons should be illegal too...
          */}
          <div>
            <Button variant="contained" color="primary" onClick={() => this.setTableNumber(1)}>1</Button>
            <Button variant="contained" color="primary" onClick={() => this.setTableNumber(2)}>2</Button>
            <Button variant="contained" color="primary" onClick={() => this.setTableNumber(3)}>3</Button>
          </div>
        </LeftBox>
        <RightBar>
          <Button variant="contained" color="secondary" onClick={() => this.goToMain()}>Go back</Button>
          <TextField
            id="outlined-read-only-input"
            label="Table number"
            value={this.state.value}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
          <Button variant="contained" disabled={!this.state.allowed}>
            Go to next page
          </Button>
        </RightBar>
      </div>
    );
  }
}

export const Table = withStyles(styles)(TablePage);
