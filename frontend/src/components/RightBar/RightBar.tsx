import React, { ReactNode } from 'react';
import { withStyles, WithStyles } from '@material-ui/core';

import { styles } from './styles';
// import './../RightBar/RightBar.css';

interface IProps extends WithStyles<typeof styles> {
  first: ReactNode,
  second: ReactNode,
  third: ReactNode
}

class RightBarClass extends React.Component<IProps, {}> {
  doNothing() {

  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.rightbar}>
        <div className={classes.firstColumn}>
          { this.props.first }
        </div>
        <div className={classes.secondColumn}>
          { this.props.second }
        </div>
        <div className={classes.thirdColumn}>
          { this.props.third }
        </div>
      </div>
    );
  }
}

export const RightBar = withStyles(styles)(RightBarClass);
// export const RightBar = RightBarClass;
