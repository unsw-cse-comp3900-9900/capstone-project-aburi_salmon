import React from 'react';
import { withStyles } from '@material-ui/core';


import { LeftBox, RightBar } from './../../components';
import { styles } from './styles';

class TablePage extends React.Component {
  constructor(props) {
    super(props);
    
  }


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.tablepage}>
        <LeftBox>

        </LeftBox>
        <RightBar>

        </RightBar>
      </div>
    );
  }
}

export const Table = withStyles(styles)(TablePage);
