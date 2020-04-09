import React from 'react';
import { WithStyles,  withStyles,TextField, Button, Dialog, DialogContent,  DialogActions, DialogTitle, FormControl, InputLabel, Select, Input} from '@material-ui/core';
import {styles} from './styles';

export interface IProps extends WithStyles<typeof styles>{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
}

class ResetRegist extends React.Component<IProps, {}>{

    render() {
        return (
            <div>
                <Dialog open={this.props.isOpen} onClose={() => this.props.setIsOpen(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change Registration Key</DialogTitle>
                    <DialogContent>
                        <form>
                            <FormControl className={this.props.classes.formControl}>
                                <InputLabel htmlFor="demo-dialog-native">Staff Type</InputLabel>
                                <Select
                                    native
                                    onChange={(e) => console.log(e.target.value)}
                                    input={<Input id="demo-dialog-native" />}>
                                    <option aria-label="None" value="" />
                                    <option value={"Manage"}>Manage</option>
                                    <option value={"Wait"}>Wait</option>
                                    <option value={"Kitchen"}>Kitchen</option>
                                </Select>
                            </FormControl>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="pass"
                                label="New Key"
                                type="password"
                                fullWidth
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="repass"
                                type="password"
                                label="Re-type New Key"
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary">
                            Reset
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(ResetRegist);