import { createStyles, Theme, fade } from "@material-ui/core";

export const styles = (theme: Theme) =>
  createStyles({
    waitingpage: {
      height: '97vh',
      width: '100%',
    },
    title: {
      margin: '30px',
      fontSize: '40px',
      height: '100%'
    },
    rightdiv: {
      width: '100%',
      padding: '15px',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: fade('#000000', 0.6),
    },
    itemmodal: {
      top: '50%',
      left: '50%',
      position: 'fixed',
      flexGrow: 1,
      width: '80%',
      height: 'auto',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      transform: `translate(-50%,-50%)`,
    },
    imageboxmodaldiv: {
      height: 450,
      width: 600,
    },
    imageboxmodal: {
      height: '100%',
      maxHeight: '100%',
      width: 'auto',
      maxWidth: '100%',
    },
    assistancebutton: {
      marginTop: '12px',
      margin: '5px',
      fontSize: '15px',
    },
    additembutton: {
      marginTop: '12px',
      margin: '5px',
      fontSize: '15px',
    },
    paybillbutton: {
      marginTop: '12px',
      margin: '5px',
      fontSize: '18px',
    },
  });