import React from 'react';
import { withStyles, WithStyles, Modal, Grid, FormControl, FormControlLabel, FormGroup} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';

import { styles } from './styles';
import { Client } from './../../../../api/client';
import { Menu as MenuModel, Item as ItemModel, Categories as CategoriesModel } from './../../../../api/models';

interface IProps extends WithStyles<typeof styles> {
  menu: MenuModel | null;
  value: string;
  changeValue: any
}

interface IState {
  openModal: boolean;
  modal: ItemModel | null; //selected item
}

class StaticMenuPage extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      openModal: false,
      modal: null,
    }
    // To bind the tab change
    this.handleTabChange = this.handleTabChange.bind(this);

    // To bind with modal change
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  generateItemsInCategory(category: CategoriesModel) {
    const { classes } = this.props;
    const categoryName = category.name;
    return (
      <div hidden={this.props.value !== categoryName} id={`tabpanel-${category.id}`} key={category.id} aria-labelledby={`tab-${category.id}`}>
        {
          category.items.map((item,index) => (
            <Card className={classes.itemcard} key={index}>
              <CardContent>
                <Typography variant="h5">
                  {item.name}
                </Typography>
                <Typography variant="body2" component="p">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => this.openModal(item)}>View item</Button>
              </CardActions>
            </Card>
          ))
        }
      </div>
    )
  }

  handleTabChange(event: React.ChangeEvent<{}>, newValue: string) {
    this.props.changeValue(newValue);
    /*
    this.setState({
      value: newValue,
    });*/
  }

  openModal(item: ItemModel) {
    this.setState({
      openModal: true,
      modal: item,
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

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.menupage}>
            <div className={classes.wrapper}>
              <AppBar position="static">
                <Tabs
                  value={this.props.value}
                  onChange={this.handleTabChange}
              scrollButtons="auto"
              variant="scrollable"
                >
                  {
                    this.props.menu && this.props.menu?.menu &&
                    this.props.menu?.menu.map(category => (
                      <Tab label={category.name} key={category.id} {...this.tabProps(category.name)} />
                    ))
                  }
                </Tabs>
              </AppBar>
              <div className={classes.overflow}>
              {
                this.props.menu && this.props.menu?.menu &&
                this.props.menu?.menu.map(category => this.generateItemsInCategory(category))
              }
              </div>
            </div>

        <Modal
          aria-labelledby=""
          aria-describedby=""
          open={this.state.openModal}
          onClose={this.handleCloseModal}
          className={classes.modal}
        >
          <div className={classes.itemmodal}>
            <Grid container spacing={1}>
              {/* First col */}
              <Grid item xs={11}>
                <Typography variant="h4">{this.state.modal?.name}</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton aria-label="close" onClick={this.handleCloseModal}>
                  <Icon>close</Icon>
                </IconButton>
              </Grid>

              {/* Second col */}
              <Grid item xs={8}>
                <div className={classes.imageboxmodaldiv}>
                  <img src={this.state.modal?.image_url} className={classes.imageboxmodal} />
                </div>
                    </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">Ingredients</Typography>
                <FormControl>
                  <FormGroup>
                    {
                      this.state.modal && this.state.modal?.ingredients &&
                      this.state.modal?.ingredients.map((ingredient,index) => (<FormControlLabel
                        control={<Checkbox checked={true} />}
                        disabled
                        key={index}
                        label={ingredient.name}
                      />))
                    }
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="subtitle1">{this.state.modal?.description}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1">${this.state.modal?.price.toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div >
    );
  }
}

export const StaticMenu = withStyles(styles)(StaticMenuPage);
