import { createStyles, Theme} from "@material-ui/core";

export const styles = (theme: Theme) =>
  createStyles({
    table: {
      minWidth: 550,
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
    registBut: {
      float: "left"
    },
    tableBut: {
      float: "right",
    },
    wrapper1: {
      height: '92%',
      width: '100%',
      //overflow: 'auto',
    },
    wrapper2: {
      height: '8%',
      width: '100%',

    },
    tableCont: {
      maxHeight: '95%',
    }
  });