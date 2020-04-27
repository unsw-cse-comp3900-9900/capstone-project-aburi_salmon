import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, FormControl, InputLabel, NativeSelect} from '@material-ui/core';


// renders a Help dialog
export interface IProps {
    isOpen: boolean, //state of dialog
    setIsOpen: any, //function to change state of is open
}
class Help extends React.Component<IProps, {}>{


    render() {
        return (
            <div>
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.props.setIsOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"How to Create a Menu"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <b>Preparing stage </b><br></br>
                            1. Tap on the button 'CREATE ITEM' on the bottom right to create items. <br></br>
                            2. Tap on the button 'ADD CATEGORY' next to 'CREATE ITEM' to create categories. <br></br>
                            <b>Creating the menu</b> <br></br>
                            3. Tap on 'ADD ITEM TO CATEGORY' to add items you've created to categories you've created. <br></br>
                            <b>Customising items</b> <br></br>
                            4. To add/remove ingredients to the ingredients list, tap 'EDIT INGREDIENTS'. <br></br>
                            5. Once items are in the menu, you can tap on 'VIEW ITEM' to see it's details. You can then
                            tap on 'EDIT INGREDIENTS' to add/remove ingredients from the item. <br></br>
                            <b>Editing the menu</b><br></br>
                            6. To change item details, tap on 'VIEW ITEM' on that item card, then 'EDIT ITEM'. Fill
                            in the details that you want to be displayed then Tap 'MODIFY ITEM'.<br></br>
                            7. To edit a category, tap on the pencil icon next to the category. <br></br>
                            8. To permanently delete items from the list of items, tap 'DELETE ITEM' next to the 'HELP' button <br></br>
                            9. To remove an item from a category, tap 'REMOVE ITEM' on the item card. This will only remove item
                            from the category, but it will stay in the items list. <br></br>

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.setIsOpen(false)} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
  
    }
}

export default Help;