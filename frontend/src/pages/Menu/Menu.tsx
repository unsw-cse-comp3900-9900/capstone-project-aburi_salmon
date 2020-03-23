import React from 'react';
import { withStyles, TextField, WithStyles, createStyles, Modal } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import history from '../../history';
import { LeftBox, RightBar } from '../../components';

import { styles } from './styles';
import { Client } from '../../api/client';
import { Menu as MenuModel, Item as ItemModel } from '../../api/models';

interface IProps extends WithStyles<typeof styles> { }

interface IState {
  menu: MenuModel | null;
  value: string;
  openModal: boolean;
}

class MenuPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      menu: null,
      value: "Sushi",
      openModal: false,
    }
    // To bind the tab change
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  generateItemsInCategory(items: Array<ItemModel>, categoryName: string){
    const { classes } = this.props;
    return (
      <div hidden={this.state.value !== categoryName} id={`tabpanel-${categoryName}`} key={categoryName} aria-labelledby={`tab-${categoryName}`}>
        {
          items.map(item => (
            <Card className={classes.itemcard} key={item.id}>
              <CardContent>
                <Typography variant="h5">
                  {item.name}
                </Typography>
                <Typography variant="body2" component="p">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Add item</Button>
              </CardActions>
            </Card>
          ))
        }
      </div>
    )
  }

  goToTable() {
    history.push('/table');
  }

  handleTabChange(event: React.ChangeEvent<{}>, newValue: string) {
    this.setState({
      value: newValue,
    });
  }

  handleOpenModal(event: React.ChangeEvent<{}>) {

  }

  handleCloseModal(event: React.ChangeEvent<{}>) {

  }

  tabProps(index: string) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
      value: `${index}`,
    };
  }

  // Component did mount gets called before render
  async componentDidMount() {
    const client = new Client();
    const m: MenuModel | null = await client.getMenu();
    this.setState({ 
      menu: m, 
      value: m?.menu[0].cat ? m?.menu[0].cat : "",
    });
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
                  onChange={this.handleTabChange}
                >
                  {
                    this.state.menu?.menu.map(category => (
                      <Tab label={category.cat} key={category.cat} {...this.tabProps(category.cat)}/>
                    ))
                  }
                </Tabs>
              </AppBar>
              {
                this.state.menu?.menu.map(category => this.generateItemsInCategory(category.item, category.cat))
              }
              <Modal
                aria-labelledby=""
                aria-describedby=""
                open={this.state.openModal}
                onClose={this.handleCloseModal}
              >
                <div>
                  
                </div>
              </Modal>
            </div>
          }
        />

        <RightBar
          first={
            <div>
              <Button className={classes.assistancebutton} variant="contained" color="primary">Help</Button>
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
