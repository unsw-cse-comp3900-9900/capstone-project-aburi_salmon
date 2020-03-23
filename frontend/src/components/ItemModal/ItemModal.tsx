

import React, { ReactNode } from 'react';
import { withStyles, WithStyles } from '@material-ui/core';

import { styles } from './styles';
// import './../LeftBox/LeftBox.css';

interface IProps extends WithStyles<typeof styles> { 

}

class ItemModalClass extends React.Component<IProps, {}> {
  render() {
    const { classes } = this.props;
    return (
      <div>
          
      </div>
    );
  }
}

export const ItemModal = withStyles(styles)(ItemModalClass);