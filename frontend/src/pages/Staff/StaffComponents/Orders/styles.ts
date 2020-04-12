import { createStyles, Theme} from "@material-ui/core";

export const styles = (theme: Theme) =>
  createStyles({
    table: {
      minWidth: 550,
      tableLayout: 'fixed',
    },
    wrapper: {
      height: '100%',
      width: '100%',
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(1),
    },
    rows: {
      paddingLeft: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    head: {
      position: 'sticky',
      top: '0px',
    },
    tableCont: {
      maxHeight: '95%',
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
    },

  });