import React from 'react';
import { withStyles, Button, TextField, WithStyles, createStyles } from '@material-ui/core';

import history from '../../history';
import { LeftBox, RightBar } from '../../components';

import {styles} from './styles';

interface IProps extends WithStyles<typeof styles> { }

interface IState {
  value: string;
  allowed: boolean;
}

class MenuPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: 'Select your table number',
      allowed: false
    }
  }

  goToTable() {
    history.push('/table');
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
            <div>

            </div>
          }
        />

        <RightBar
          first={
            <Button variant="contained" color="secondary" onClick={() => this.goToTable()}>Go back</Button>
          }
          second={
            <div></div>
          }
          third={
            <div></div>
          }
        />
      </div >
    );
  }
}

export const Menu = withStyles(styles)(MenuPage);
