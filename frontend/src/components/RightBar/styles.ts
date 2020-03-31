import { Theme } from "@material-ui/core";
import { createStyles, fade } from "@material-ui/core/styles";

export const styles = (theme: Theme) =>
  createStyles({
    rightbar: {
      float: 'right',
      width: '30%',
      height: '100%',
      background: fade('#0000ff', 0.45),

    },
    firstColumn: {
      height: '10%',
      width: 'auto',
    },
    secondColumn: {
      height: '75%',
      width: 'auto',
    },
    thirdColumn: {
      height: '15%',
      width: 'auto',
    }
  });
