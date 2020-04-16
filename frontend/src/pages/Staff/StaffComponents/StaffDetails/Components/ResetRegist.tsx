import React, { ReactEventHandler } from 'react';
import { WithStyles,  withStyles,TextField, Button, Dialog, DialogContent,  DialogActions, DialogTitle, FormControl, InputLabel, Select, Input} from '@material-ui/core';
import {styles} from './styles';
import { Client } from './../../../../../api/client';

export interface IProps extends WithStyles<typeof styles>{
    isOpen: boolean,
    setIsOpen: any, //function to change state of is open
    setAlert: any,
}

interface IState {
    staffType: string;
    key: string;
    keyRepeat: string;
}

class ResetRegist extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props);
        this.state = {
            staffType: 'Manage',
            key: '',
            keyRepeat: ''
        }
    }

    async resetKey(dialog: any) {
        if (this.state.key !== this.state.keyRepeat) {
            console.warn('New key does not match the retyped value');
            this.props.setAlert(true, 'error', 'New key does not match the retyped value');
            return;
        }

        if (!this.state.key) {
            console.warn('New key must have a value');
            this.props.setAlert(true, 'error', 'New key must have a value');
            return;
        }

        const client = new Client();

        if (!await client.changeRegistrationKey(this.state.staffType, this.state.key)) {
            console.error('Failed to change registration key');
            this.props.setAlert(true, 'error', 'Failed to change registration key');
            return;
        }

        this.props.setAlert(true, 'success', 'Resgistration Key Successfully Changed');
        dialog.props.setIsOpen(false);
    }



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
                                    // Werid fix for this https://stackoverflow.com/questions/58675993/typescript-react-select-onchange-handler-type-error
                                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => this.setState({ staffType: e.target.value as string })}
                                    native
                                    input={<Input id="demo-dialog-native" />}>
                                    <option value={"Manage"}>Manage</option>
                                    <option value={"Wait"}>Wait</option>
                                    <option value={"Kitchen"}>Kitchen</option>
                                </Select>
                            </FormControl>
                            <TextField
                                onChange={(e) => this.setState({ key: e.target.value })}
                                autoFocus
                                margin="dense"
                                id="pass"
                                label="New Key"
                                type="password"
                                fullWidth
                            />
                            <TextField
                                onChange={(e) => this.setState({ keyRepeat: e.target.value })}
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
                        <Button onClick={(e) => this.resetKey(this)} color="primary">
                            Reset
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(ResetRegist);