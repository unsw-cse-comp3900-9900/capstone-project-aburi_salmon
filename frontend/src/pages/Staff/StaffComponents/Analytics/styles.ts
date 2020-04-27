import { createStyles, Theme} from "@material-ui/core";

export const styles = (theme: Theme) =>
  createStyles({
    table: {
      minWidth: 300,
      tableLayout: 'fixed',
    },
    wrapper: {
      height: '100%',
      width: '100%',
      overflow: 'auto',
    },
    wrapper1: {
      height: '93%',
      width: '100%',
      overflow: 'auto',
    },
    wrapper2: {
      height: '5%',
      width: '100%',
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
    },
    tableCont: {
      maxHeight: '95%',
    },
  });