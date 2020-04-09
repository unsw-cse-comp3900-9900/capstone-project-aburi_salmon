import { createStyles, Theme} from "@material-ui/core";
export const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      height: '85vh',
    },
    menubutton: {
      marginRight: theme.spacing(1),
      paddingRight: '10px',
    },
    root: {
      display: 'flex',
    },
    staffContainer: {
      backgroundColor: 'white',
      border: '2px solid darkblue',
      padding: theme.spacing(2),
      flexGrow: 1,
      display: 'flex',
      top: theme.spacing(2),
      left: theme.spacing(2),
      alignSelf: 'stretch',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      //overflow: 'auto'
    },
    menuContainer: {
      backgroundColor: 'lightgrey',
      border: '2px solid darkblue',
      padding: theme.spacing(2),
      flexGrow: 1,
      display: 'flex',
      top: theme.spacing(2),
      left: theme.spacing(2),
      alignSelf: 'stretch',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      //width: '100%'
      minWidth: '800px',
    },
    helpIcon: {
      float: 'right',
      paddingRight: '1%',
    },
    minSize: {
      width: theme.spacing(17),
    },
  });