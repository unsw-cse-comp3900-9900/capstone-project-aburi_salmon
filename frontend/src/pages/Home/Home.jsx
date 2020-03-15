import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import history from './../../history';
import restlogo from './../../assets/Hojiak.png';
import { styles } from './styles';

// Comment this when everything is moved to styles
// import './Homepage.css';

class PureHome extends React.Component {
  goToMenu() {
    history.push('/menu');
  }

  goToLogin() {
    history.push('/login');
  }

  render() {
    return (
      <div>
        <img src={restlogo} className="restlogo" alt="Logo" />
        <button className="myButton" onClick={() => this.goToMenu()}>
          Start Ordering
                </button>
        <Link component="button" variant="h5" color="inherit" onClick={() => this.goToLogin()}>
          Log In
                </Link>
      </div>
    );
  }
}

export const Home = withStyles(styles)(PureHome);
// export default PureHome;

