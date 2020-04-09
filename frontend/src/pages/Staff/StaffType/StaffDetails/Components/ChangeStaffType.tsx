import React from 'react';
import { createStyles,WithStyles, Theme, withStyles, Button, Dialog, DialogContent, DialogActions, DialogTitle, FormControl, InputLabel, Select, Input} from '@material-ui/core';

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
    changeStaffType: any,
    username: string,
}

class ChangeStaffType extends React.Component<IProps, {staffType: number}>{

    constructor(props:IProps){
        super(props);
        this.state = {
            staffType: 3,
        }
    }

    changeStaffType(e: any){
        this.setState({staffType: parseInt(e.target.value)});

    }

    render() {
        return (
            <div>
                <Dialog open={this.props.isOpen} onClose={() => this.props.setIsOpen(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change {this.props.username}'s Staff Type</DialogTitle>
                    <DialogContent>
                        <form>
                            <FormControl className={this.props.classes.formControl}>
                                <InputLabel htmlFor="demo-dialog-native">Staff Type</InputLabel>
                                <Select
                                    native
                                    onChange={(e) => this.changeStaffType(e)}
                                    input={<Input id="demo-dialog-native" />}>

                                    <option value={3}>Manage</option>
                                    <option value={1}>Wait</option>
                                    <option value={2}>Kitchen</option>
                                </Select>
                            </FormControl>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() =>  this.props.setIsOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.props.changeStaffType(this.state.staffType)} color="primary">
                            Change
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(ChangeStaffType);