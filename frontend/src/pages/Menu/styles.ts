import { createStyles, Theme, fade } from "@material-ui/core";

export const styles = (theme: Theme) =>
  createStyles({
    menupage: {
      height: '97vh'
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
      maxWidth: '100%',
      margin: '13px',
    },
    itemname: {
      fontSize: 14,
    },
    itemmodal: {
      top: '50%',
      left: '50%',
    },
    cardaction: {
      display: 'block',
      textAlign: 'initial',
    },
    divmodal: {
      position: 'absolute',
      flexGrow: 1,
      width: '60vw',
      height: '45vw',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    }
  });
