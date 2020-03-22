import { createStyles, Theme, fade } from "@material-ui/core";

export const styles = (theme: Theme) =>
  createStyles({
    tablepage: {
      height: '97vh',
    },
    title: {
      margin: '10px',
      fontSize: '20px',
      background: fade(theme.palette.common.black, 0.4),
      height: '100%',
    },
    tablebutton: {
      margin: '20px',
      fontSize: '30px',
    },
    gobackbutton: {
      margin: '10px',
      fontSize: '25px',
    },
    gotonextpagebutton: {
      margin: '10px',
      fontSize: '25px',
    }
  });