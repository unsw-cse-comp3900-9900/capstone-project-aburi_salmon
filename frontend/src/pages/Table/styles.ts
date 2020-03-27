import { createStyles, Theme, fade } from "@material-ui/core";

export const styles = (theme: Theme) =>
  createStyles({
    tablepage: {
      height: '97vh',
    },
    title: {
      margin: '30px',
      fontSize: '40px',
      height: '100%'
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