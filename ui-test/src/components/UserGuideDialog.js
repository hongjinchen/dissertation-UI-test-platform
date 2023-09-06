import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem } from '@material-ui/core';

function UserGuideDialog({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant="h5" color="primary">
                    Welcome to GWT UI Testing Platform!
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Here's a quick rundown of what you can do on group space:
                </Typography>
                <List>
                    <ListItem>
                        <Typography variant="body1" color="textSecondary"><strong>Create a new group:</strong></Typography>
                    </ListItem>
                    <List>
                        <ListItem>
                            <Typography variant="body2">Click on the card with the '+' icon to start a new team. You can add team details and search for members to add. You can only do UI testing if you have created or joined a team.</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body2">Search members: When creating a team, you can search for users by name. Simply type in the search field and click on the search button.</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="body2">Manage team members: When creating a team, you can add or remove members before finalizing the team creation.</Typography>
                        </ListItem>
                    </List>
                    <ListItem>
                        <Typography variant="body1" color="textSecondary"><strong>View existing groups:</strong></Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="body2">All the teams you're a part of are listed below. Click on any of them to view more details or interact with the team members.</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="body1" color="textSecondary"><strong>View tutorials:</strong></Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="body2">We've listed several tutorials for you, from basic HTML to user behaviour guidelines, so once you've found the tutorial you're interested in, just click the "View Tutorial" button.</Typography>
                    </ListItem>
                </List>
                <Typography variant="body1">
                    Enjoy collaborating with your teams!
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={onClose}>
                    Got it!
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserGuideDialog;
