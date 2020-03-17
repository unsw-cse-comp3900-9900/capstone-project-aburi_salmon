

import React from 'react';
import { withStyles, WithStyles } from '@material-ui/core';

import { styles } from './styles';
// import './../LeftBox/LeftBox.css';

interface IProps extends WithStyles<typeof styles> { }

class LeftBoxClass extends React.Component<IProps, {}> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.leftbox}>
        left box
        {/* I want this component to have 2 children */}
        {this.props.children}
      </div>
    );
  }
}

export const LeftBox = withStyles(styles)(LeftBoxClass);
// export const LeftBox = LeftBoxClass;
