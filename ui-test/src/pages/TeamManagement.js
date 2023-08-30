import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTeam, deleteTeam, addTeamMember, removeTeamMember } from '../api';
import {
    makeStyles,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    TextField,
    Typography,
    Container,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Paper,
    Grid
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Navigation from "../components/SubNavigation";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    toolbar: {
        paddingRight: 24,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        marginTop: 64,
        height: "100vh",
        overflow: "auto",
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        transition: 'all 0.3s',
        '&:hover': {
            backgroundColor: '#f5f5f5', // Optional: change background color on hover
        },
    },
}));

function TeamManager() {
    const { id } = useParams();
    const classes = useStyles();
    const [team, setTeam] = useState(null);
    const [newMemberName, setNewMemberName] = useState('');
    const [deleteTeamDialogOpen, setDeleteTeamDialogOpen] = useState(false);
    const [deleteMemberDialogOpen, setDeleteMemberDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [transferManagerDialogOpen, setTransferManagerDialogOpen] = useState(false);
    const [newManager, setNewManager] = useState('');
    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false); // 新增状态

    useEffect(() => {
        fetchTeam(id).then(data => {
            setTeam(data);
        });
    }, [id]);

    const handleDeleteTeam = async () => {
        await deleteTeam(id);
        setDeleteTeamDialogOpen(false);
    };

    const handleAddMember = async () => {
        if (!newMemberName) return;
        await addTeamMember(id, newMemberName);
        setTeam(prev => {
            return { ...prev, members: [...prev.members, newMemberName] };
        });
        setNewMemberName('');
    };

    const handleOpenDeleteMemberDialog = (member) => {
        if (member === 'manager') return;
        setDeleteMemberDialogOpen(true);
        setMemberToDelete(member);
    };

    const handleConfirmDeleteMember = async () => {
        await removeTeamMember(id, memberToDelete);
        setTeam(prev => ({ ...prev, members: prev.members.filter(member => member !== memberToDelete) }));
        setDeleteMemberDialogOpen(false);
    };

    const handleOpenTransferManagerDialog = () => {
        setTransferManagerDialogOpen(true);
    };

    const handleConfirmTransferManager = () => {
        // Logic to transfer the manager status. This will require API/backend support.
        setTransferManagerDialogOpen(false);
    };

    if (!team) return <Container><CircularProgress /></Container>;

    return (
        <div className={classes.root}>
            <Navigation title="Team Management" id="id" />

            {/* Delete team confirmation dialog */}
            <Dialog
                open={deleteTeamDialogOpen}
                onClose={() => setDeleteTeamDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Team"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this team?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTeamDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteTeam} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete member confirmation dialog */}
            <Dialog
                open={deleteMemberDialogOpen}
                onClose={() => setDeleteMemberDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Member"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this member?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteMemberDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDeleteMember} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Transfer manager confirmation dialog */}
            <Dialog
                open={transferManagerDialogOpen}
                onClose={() => setTransferManagerDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Transfer Manager Status"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please select the new manager from the list below:
                    </DialogContentText>
                    <TextField
                        select
                        label="New Manager"
                        value={newManager}
                        onChange={e => setNewManager(e.target.value)}
                        fullWidth
                    >
                        {team.members.map(member => (
                            member !== 'manager' && <MenuItem key={member} value={member}>
                                {member}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTransferManagerDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmTransferManager} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/*Add Member Dialog */}
            <Dialog
                open={addMemberDialogOpen}
                onClose={() => setAddMemberDialogOpen(false)}
                aria-labelledby="add-member-dialog-title"
                aria-describedby="add-member-dialog-description"
            >
                <DialogTitle id="add-member-dialog-title">{"Add New Member"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="add-member-dialog-description">
                        Please enter the name of the new member:
                    </DialogContentText>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Member Name"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddMemberDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={async () => {
                        await handleAddMember();
                        setAddMemberDialogOpen(false);
                    }} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <main className={classes.content}>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Paper
                                className={classes.paper}
                            >
                                <Typography component="h1" variant="h4" color="inherit" noWrap>
                                   {team.name}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    <strong>Description:</strong> {team.description}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Created At:</strong> {team.created_at}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Updated At:</strong> {team.updated_at}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Manager ID:</strong> {team.manager_id}
                                </Typography>
                            </Paper>

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <Paper className={classes.paper} style={{ marginTop: 20 }}>
                                <List>
                                    {/* Add Member button as ListItem */}
                                    <ListItem button onClick={() => setAddMemberDialogOpen(true)}>
                                        <ListItemText primary="Add a New Member" />
                                    </ListItem>

                                    {/* Transfer Manager Status button as ListItem */}
                                    <ListItem button onClick={handleOpenTransferManagerDialog}>
                                        <ListItemText primary="Transfer Manager Status" />
                                    </ListItem>

                                    {/* Delete Team button as ListItem */}
                                    <ListItem button onClick={() => setDeleteTeamDialogOpen(true)}>
                                        <ListItemText primary="Delete Team" />
                                    </ListItem>
                                </List>

                            </Paper>

                            <Paper className={classes.paper} style={{ marginTop: 20 }}>
                                <Typography variant="h6" gutterBottom>
                                    Members:
                                </Typography>
                                <List>
                                    {team.members.map(member => (
                                        <ListItem key={member}>
                                            <ListItemText primary={member} />
                                            <ListItemSecondaryAction>
                                                <Button
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleOpenDeleteMemberDialog(member)}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>



                </Container>
            </main>
        </div>
    );
}

export default TeamManager;
