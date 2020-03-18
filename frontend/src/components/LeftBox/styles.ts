import { createStyles, fade, Theme } from "@material-ui/core/styles";

export const styles = (theme: Theme) =>
  createStyles({
    leftbox: {
      float: 'left',
      width: '70%',
      // height: '100%',
      backgroundColor: fade(theme.palette.common.white, 0.15)
    }
  });
