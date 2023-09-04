import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

function UserGuideDialog() {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Welcome to GWT UI Testing Platform!</DialogTitle>
            <DialogContent>
                <p>
                    Here's a quick rundown of what you can do on group space:
                </p>
                <ul>
                    <li><strong>Create a new group:</strong> Click on the card with the '+' icon to start a new team. You can add team details and search for members to add.</li>
                    <li><strong>Search members:</strong> When creating a team, you can search for users by name. Simply type in the search field and click on the search button.</li>
                    <li><strong>Manage team members:</strong> When creating a team, you can add or remove members before finalizing the team creation.</li>
                    <li><strong>View existing groups:</strong> All the teams you're a part of are listed below. Click on any of them to view more details or interact with the team members.</li>
              
                </ul>
                <p>
                    Enjoy collaborating with your teams!
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Got it!</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserGuideDialog;
