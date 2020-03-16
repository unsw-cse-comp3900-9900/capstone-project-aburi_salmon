

import React from 'react';
import { withStyles } from '@material-ui/core';

import { styles } from './styles';
// import './../LeftBox/LeftBox.css';

class LeftBoxClass extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.leftbox}>
        left box
        {/* I want this component to have 2 children */}
      </div>
    );
  }
}

export const LeftBox = withStyles(styles)(LeftBoxClass);
// export const LeftBox = LeftBoxClass;
