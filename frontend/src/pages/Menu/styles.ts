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
    itemcard: {
      minWidth: 275,
    },
    itemname: {
      fontSize: 14,
    }
  });
