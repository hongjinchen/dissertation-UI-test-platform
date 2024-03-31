import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTeam, deleteTeam, addTeamMember, removeTeamMember, searchUsers, transferManager } from '../api';
import {
    makeStyles,
    Snackbar,
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
    ListItemAvatar,
    Grid,
    Avatar,
    IconButton 
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Navigation from "../components/SubNavigation";
import Cookies from 'js-cookie';
import { API_BASE_URL, axiosInstance } from "../config";

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
    const [deleteTeamDialogOpen, setDeleteTeamDialogOpen] = useState(false);
    const [deleteMemberDialogOpen, setDeleteMemberDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [transferManagerDialogOpen, setTransferManagerDialogOpen] = useState(false);
    const [newManager, setNewManager] = useState('');
    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchUserName, setSearchTerm] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [confirmUsername, setConfirmUsername] = useState('');
    const [confirmUsernameError, setConfirmUsernameError] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(0);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchTeam(id).then(data => {
            setTeam(data);
        });
    }, [id]);

    const showMessage = (msg) => {
        setMessage(msg);
        setOpenSnackbar(true);
    };

    const handleSubmitEmail = async () => {
        try {
            const result = await axiosInstance.post(`${API_BASE_URL}/check-email`, { email });
            if (result.data.status === 'success') {
                setStep(1);
                showMessage("A verification code has been sent to your email.");
            } else {
                showMessage(result.data.message || "Mailbox input error, can't change password");
            }
        } catch (error) {
            showMessage("Error sending verification code");
            console.error('Error:', error);
        }
    };

    const handleVerifyCode = async () => {
        try {
            const result = await axiosInstance.post(`${API_BASE_URL}/verify-code`, { email, code });
            if (result.data.status === 'success') {
                setStep(2);
                showMessage("");
            } else {
                showMessage(result.data.message || "Verification failed, incorrect code.");
            }
        } catch (error) {
            showMessage("Error verifying code");
            console.error('Error:', error);
        }
    };


    const handleDeleteTeam = async () => {
        // if (confirmUsername === getCurrentUserUsername()) {
        if (confirmUsername === "3493007331@qq.com") {
            await deleteTeam(id);
            setDeleteTeamDialogOpen(false);
            setConfirmUsername('');
            setConfirmUsernameError(false);
        } else {
            setConfirmUsernameError(true);
        }

    };

    const handleAddMember = async () => {
        if (!teamMembers) return;
        try {
            const message = await addTeamMember(id, teamMembers);
            console.log(message);
            setTeam(prev => {
                return { ...prev, members: [...prev.members, teamMembers] };
            });
            setSearchTerm('');

            window.location.reload();
            setSnackbarMessage('Member successfully added');
            setSnackbarOpen(true); // 打开Snackbar显示成功消息
        } catch (error) {
            setSnackbarMessage('Failed to add member');
            setSnackbarOpen(true);
            alert(error.message);
        }
    };

    const handleOpenDeleteMemberDialog = (member) => {
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

    const handleConfirmTransferManager = async () => {
        try {
            await transferManager(id, newManager);
            setTransferManagerDialogOpen(false);
            window.location.reload();
        } catch (error) {
            alert("There was an error transferring the manager:", error)
        }
    };

    const handleSearch = async (userName) => {
        setIsSearching(true);
        try {
            const newSearchResults = await searchUsers(userName);
            setSearchResults(newSearchResults);
            setErrorMessage(""); // 清除任何先前的错误消息
        } catch (error) {
            setErrorMessage(error.message); // 设置错误消息
        } finally {
            setIsSearching(false);
        }
    };

    const addMember = (user) => {
        setTeamMembers([...teamMembers, user]);
    };
    const removeMember = (index) => {
        setTeamMembers(teamMembers.filter((_, i) => i !== index));
    };

    if (!team) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh"
                }}
            >
                <CircularProgress />
            </div>
        );
    }
    return (
        <div className={classes.root}>
            <Navigation title="Team Management" id="id" />

            {/* Delete team confirmation dialog */}
            <Dialog open={deleteTeamDialogOpen} onClose={() => setDeleteTeamDialogOpen(false)}>
                <DialogTitle>{"Delete Team"}</DialogTitle>
                <DialogContent>
                    {step === 0 && (
                        <>
                            <DialogContentText>
                                Please enter your email to receive a verification code.
                            </DialogContentText>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </>
                    )}
                    {step === 1 && (
                        <>
                            <DialogContentText>
                                Please enter the verification code sent to your email.
                            </DialogContentText>
                            <TextField
                                label="Verification Code"
                                type="text"
                                fullWidth
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {step === 0 && <Button onClick={handleSubmitEmail} color="primary">Send Code</Button>}
                    {step === 1 && <Button onClick={handleVerifyCode} color="primary">Verify Code</Button>}
                    {step === 2 && (
                        <>
                            <Button onClick={() => setDeleteTeamDialogOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteTeam} color="primary" autoFocus>
                                Confirm
                            </Button>
                        </>
                    )}
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
                            member !== 'manager' && <MenuItem key={member.id} value={member.id}>
                                {member.username}
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
                        Please enter the name or ID of the user you want to add:
                    </DialogContentText>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Search Members"
                            value={searchUserName}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button onClick={() => handleSearch(searchUserName)}>Search</Button>
                    </Grid>

                    <Grid item xs={12}>
                        {searchResults.length > 0 && (
                            <Paper className={classes.searchResults} elevation={1}>
                                <List>
                                    {searchResults.map((user) => (

                                        <ListItem
                                            className={classes.listItem}
                                            button
                                            key={user.id}
                                            onClick={() => addMember(user)}
                                            disabled={teamMembers.some(member => member.id === user.id)}
                                        >

                                            <ListItemAvatar>
                                                <Avatar>{user.name.charAt(0)}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={user.name} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <List>
                            {teamMembers.map((member, index) => (
                                <ListItem className={classes.listItem} key={index}>
                                    {member.name}
                                    <Button onClick={() => removeMember(index)}>Remove</Button>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
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
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />

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
                            {parseInt(Cookies.get('userId')) === team.manager_id && (
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
                            )}
                            <Paper className={classes.paper} style={{ marginTop: 20 }}>
                                <Typography variant="h6" gutterBottom>
                                    Members List
                                </Typography>
                                <List>
                                    {team && Array.isArray(team.members) ?
                                        team.members.map(member => (
                                            <ListItem key={member.id}>
                                                <ListItemText primary={member.username} />
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
                                        ))
                                        : null}

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
