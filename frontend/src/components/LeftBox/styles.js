import { createStyles, fade } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  leftbox: {
    float: 'left',
    width: '70%',
    height: '100%',
    backgroundColor: fade(theme.palette.common.white, 0.15)
  }
}));
