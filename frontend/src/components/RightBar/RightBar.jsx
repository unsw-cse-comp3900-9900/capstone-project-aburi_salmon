import React from 'react';
import { withStyles } from '@material-ui/core';

import { styles } from './styles';
// import './../RightBar/RightBar.css';

class RightBarClass extends React.Component {
  constructor(props) {
    super(props);    
  }

  doNothing() {

  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.rightbar}>
        right bar
        {/* I want this component to have 3 children */}

        {/* { this.props.children ? this.props.children : this.doNothing() }
        // { this.props.children[0] ? this.props.children[0] : this.doNothing() }
        // { this.props.children[1] }
        // { this.props.children[2] } */}
      </div>
    );
  }
}

export const RightBar = withStyles(styles)(RightBarClass);
// export const RightBar = RightBarClass;
