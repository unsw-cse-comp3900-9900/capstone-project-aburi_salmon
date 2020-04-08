import { createStyles, Theme, fade } from "@material-ui/core";

export const styles = (theme: Theme) =>
  createStyles({
    menupage: {
      height: '100%',
      width: '100%',

    },
    title: {
      margin: '30px',
      fontSize: '40px',
      // background: fade(theme.palette.common.black, 0.4),
      height: '100%'
    },
    assistancebutton: {
      marginTop: '12px',
      margin: '5px',
      fontSize: '18px',
    },
    gobackbutton: {
      marginTop: '12px',
      margin: '5px',
      fontSize: '18px',
    },
    itemlists: {
      width: '100%',
    },
    itemcard: {
      minWidth: 250,
      width: 'auto',
      margin: '13px',
    },
    itemname: {
      fontSize: 14,
    },
    cardaction: {
      display: 'block',
      textAlign: 'initial',
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
      minWidth: '70%',
      width: 'auto',
      height: 'auto',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      transform: `translate(-50%,-50%)`,
    },
    confirmmodal: {
      top: '50%',
      left: '50%',
      position: 'fixed',
      flexGrow: 1,
      minWidth: '60%',
      width: 'auto',
      height: 'auto',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      transform: `translate(-50%,-50%)`,
    },
    overflow: {
      overflow: 'auto',
      height: '90%',
      position: 'static',
    },
    wrapper: {
      height: '92%',
    },
    wrapper2: {
      width: '100%',
    },
    wrapper3: {
      height: "8%",
      width: '100%',
    },
    floatRight: {
      float: 'right',
    },
    addFloatRight: {
      float: 'right',
      margin: '10px',
    },
    floatLeft: {
      float: 'left',
    },
    editIcon: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
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
});
