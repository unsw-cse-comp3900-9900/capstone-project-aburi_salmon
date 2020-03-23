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

interface ModalState {
  modal_id: number;
  modal_name: string;
  modal_description: string;
  modal_ingredient: Array<string> | null
}

interface OrderItemState {
  id: number;
  quantity: number;
}

interface OrderState {
  items: Array<OrderItemState>;
}

interface IState {
  menu: MenuModel | null;
  value: string;
  openModal: boolean;

  // For modal inside this component
  modal: ModalState | null;

  // For list of items that user wants to order
  orders: Array<OrderItemState>;
}

class MenuPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      // If menu is null, then nothing will be generated
      menu: null,
      // Even if initial value is an empty string, componentDidMount will fill in according to the first item on cats array
      value: "",
      openModal: false,
      modal: null,
      orders: new Array<OrderItemState>(),
    }
    // To bind the tab change
    this.handleTabChange = this.handleTabChange.bind(this);

    // To bind with modal change
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.openModal = this.openModal.bind(this);
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
                <Button size="small" onClick={() => this.openModal(item.id, item.name, item.description, item.ingredient)}>Add item</Button>
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

  openModal(id: number, name: string, description: string, ingredient: Array<string>) {
    const m: ModalState = {
      modal_id: id,
      modal_name: name,
      modal_description: description,
      modal_ingredient: ingredient,
    };

    this.setState({
      openModal: true,

      // Note: always pass in the whole ModalState object when setting new state on open modal. It will break if you're not passing the whole object
      // Read https://stackoverflow.com/questions/49348996/react-change-a-json-object-in-setstate
      modal: m,
    });

    

  }

  handleCloseModal(event: React.ChangeEvent<{}>) {
    this.setState({
      openModal: false,
    })
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
                className={classes.itemmodal}
              >
                <div className={classes.divmodal}>
                  <h2>{this.state.modal?.modal_name}</h2>
                  <p>{this.state.modal?.modal_description}</p>
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
