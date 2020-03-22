

import React, { ReactNode } from 'react';
import { withStyles, WithStyles } from '@material-ui/core';

import { styles } from './styles';
// import './../LeftBox/LeftBox.css';

interface IProps extends WithStyles<typeof styles> { 
  first: ReactNode,
  second: ReactNode
}

class LeftBoxClass extends React.Component<IProps, {}> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.leftbox}>
        <div className={classes.firstColumn}>
          { this.props.first }
        </div>
        <div className={classes.secondColumn}>
          { this.props.second }
        </div>
      </div>
    );
  }
}

export const LeftBox = withStyles(styles)(LeftBoxClass);
// export const LeftBox = LeftBoxClass;
