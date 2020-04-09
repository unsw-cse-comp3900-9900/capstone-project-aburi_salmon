import { createStyles, Theme} from "@material-ui/core";
import background from './../../assets/FoodBackground.jpg';
export const styles = (theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
    wrapper: {
      height: '97vh',
      width: '100%',
      backgroundImage: background,
    },
    menubutton: {
      marginRight: theme.spacing(1),
      paddingRight: '10px',
    },
    root: {
      display: 'flex',
    },
    appbar: {
      background: 'black',
    }
  });