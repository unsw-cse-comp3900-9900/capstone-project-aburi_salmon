import { createStyles, Theme, fade } from "@material-ui/core";

export const styles = (theme: Theme) =>
  createStyles({
    menupage: {
      height: '97vh'
    },
    title: {
      margin: '10px',
      fontSize: '20px',
      background: fade(theme.palette.common.black, 0.4),
      height: '100%'
    },
    assistancebutton: {
      margin: '10px',
      fontSize: '12px',
    },
    gobackbutton: {
      margin: '10px',
      fontSize: '24px',
    },
  });
