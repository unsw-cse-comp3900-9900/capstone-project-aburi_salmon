import React from 'react';
import { withStyles, TextField, WithStyles, createStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import history from '../../history';
import { LeftBox, RightBar } from '../../components';

import { styles } from './styles';
import { Client } from '../../api/client';
import { Menu as MenuModel } from '../../api/models';

interface IProps extends WithStyles<typeof styles> { }

interface IState {
  menu: MenuModel | null;
  value: string;
}

class MenuPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      menu: null,
      value: "",
    }
  }

  goToTable() {
    history.push('/table');
  }

  handleTabChange() {

  }

  // Component did mount gets called before render
  async componentDidMount() {
    const client = new Client();
    const m: MenuModel | null = await client.getMenu();
    this.setState({ menu: m });
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
              <AppBar position="static">
                <Tabs
                  value={this.state.value}
                  onChange={() => this.handleTabChange()}
                >
                  {
                    this.state.menu?.menu.map(category => (
                      <Tab label={category.cat} />
                    ))
                  }
                </Tabs>
              </AppBar>
              {
                // this.state.menu?.menu.map(category => (
                //   <TabPanel value={this.state.value}>
                //     {/* insert all items here*/}
                //   </TabPanel>
                // ))
              }
            </div>
          }
        />

        <RightBar
          first={
            <div>
              <Button className={classes.assistancebutton} variant="contained" color="primary">Request assistance</Button>
              <Button className={classes.gobackbutton} variant="contained" color="secondary" onClick={() => this.goToTable()}>Go back</Button>
            </div>
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
