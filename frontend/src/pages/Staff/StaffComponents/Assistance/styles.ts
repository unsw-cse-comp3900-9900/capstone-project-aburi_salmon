import { createStyles, Theme} from "@material-ui/core";
export const styles = (theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
    container: {
      height: '90%',
      width: '100%',
      overflow: 'auto',
    },
    container2: {
      height: '10%',
      width: '100%',
    },
    container3: {
      height: '100%',
      width: '100%',
    },
    wrapper: {
      width: '100%',
      textAlign: 'left',
    },
    key: {
      position: 'relative',
      bottom: '-25%',
    },
    red: {
      color: 'red',
      backgroundColor: 'white',
    },
    green: {
      color: 'green',
      backgroundColor: 'white',
    },
    helpIcon: {
      float: 'right',
      paddingRight: '2.5%',
    },
    line: {
      width: '100%',
    },
    wrappert: {
      width: '100%',
      paddingLeft: '2%',
      height: '95%',
      paddingRight: '2%',
    },
    wrapper1: {
      width: '100%',
      paddingLeft: '2%',
      height: '85%',
      paddingRight: '2%',
      overflow: 'auto',
      display: 'block',
    },
    wrapper2: {
      width: '100%',
      paddingLeft: '2%',
      height: '10%',
      paddingRight: '2%',
    },
    text: {
      float: 'left',
    },
    paidBut: {
      float: 'right',
    },
    itemTable: {
      width: '100%',
    },
    empty: {
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      height: '95%',
    },
    bottom: {
      bottom: '10%',
    },
    center: {
      textAlign: 'center',
    },
    centerText: {
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }

  });