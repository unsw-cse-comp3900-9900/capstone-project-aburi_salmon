import React from "react";
import { withStyles } from '@material-ui/core';

import { styles } from './styles';

class WaitingPage extends React.Component<{}, {}> {

  
  render() {
    return (
      <div></div>
    )
  }
}

export const Waiting = withStyles(styles)(WaitingPage);
