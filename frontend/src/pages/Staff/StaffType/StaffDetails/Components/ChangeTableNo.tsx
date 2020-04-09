import React from 'react';
import { createStyles,WithStyles, Theme, withStyles, Button, Dialog, DialogContent, TextField, DialogContentText, DialogActions, DialogTitle} from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
    });

export interface IProps extends WithStyles<typeof styles>{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
}

class ChangeTableNo extends React.Component<IProps, {}>{

    render() {
        return (
            <div>
                <Dialog open={this.props.isOpen} onClose={() => this.props.setIsOpen(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change No. of Tables</DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            !Please be wary that changing the number of tables will refresh current orders. This is only intended for initial setup
                            before you start using the system.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="tableno"
                            label="Enter number"
                            fullWidth
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary">
                            Change
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(ChangeTableNo);