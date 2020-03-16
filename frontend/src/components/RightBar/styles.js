import { createStyles, fade } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  rightbar: {
    float: 'right',
    width: '30%',
    height: '100%',
    background: fade(theme.palette.common.black, 0.15)
  }
}));
