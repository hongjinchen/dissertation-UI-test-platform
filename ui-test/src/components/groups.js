import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Paper,
  Grid,
  Button,
  Typography,
  TextField,
  ListItem,
  List,
  Box,
  Dialog,
  Slide,
  CircularProgress
} from "@material-ui/core";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { createTeam, searchUsers, fetchUserTeams } from "../api";
import UserGuideDialog from "../components/UserGuideDialog";
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
  },
  groupName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  groupTime: {
    fontSize: "1rem",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  groupLink: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  textFieldContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  paperCreat: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
  addButton: {
    marginBottom: theme.spacing(1),
  },
  listItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: "space-between",
  },

  searchResults: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  fixedHeight: {
    height: "14vh",
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();

  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [searchUserName, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showGuideDialog, setShowGuideDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');

    if (!hasSeenGuide) {
      setShowGuideDialog(true);
    }

    const getUserData = async () => {

    };

    getUserData();
  }, [isAdding]);

  // 新增的函数来关闭UserGuideDialog，并将其标记为已查看
  const handleCloseGuideDialog = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setShowGuideDialog(false);
  };


  const handleSearch = async (userName) => {
    const newSearchResults = await searchUsers(userName, Cookies.get('userId'));
    console.log(newSearchResults);
    setSearchResults(newSearchResults);
  };

  const resetForm = () => {
    setTeamName("");
    setTeamDescription("");
    setSearchTerm("");
    setTeamMembers([]);
    setSearchResults([]);
  };

  const addMember = (user) => {
    const isUserInTeam = teamMembers.some(member => member.id === user.id);
    if (user.id === parseInt(Cookies.get('userId'))) {
      alert('Can not choose yourself as a member!');
    } else if (isUserInTeam) {
      alert('This user has been added!');
    } else {
      setTeamMembers([...teamMembers, user]);
    }
  };

  const removeMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const submitForm = async () => {
    const response = await createTeam(teamName, teamDescription, teamMembers, Cookies.get('userId'));
    console.log(response);
    if (response.status === 'success') {
      alert('Team created successfully');
      resetForm();
      setIsAdding(false);
      // 刷新页面
      window.location.reload();
    } else {
      console.log(response.error);
      alert(response.error);
    }
  };




  const AddNewGroup = () => {
    setIsAdding(true);
  };
  const handleClose = () => {
    resetForm();
    setIsAdding(false);
  };

  // 显示team列表的逻辑
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetchUserTeams(Cookies.get('userId'));
        setGroups(response.data.teams);
      } catch (error) {
        console.error("Error fetching user teams:", error);
      } finally {
        setLoading(false); // Set loading to false when data fetch is complete
      }
    };

    getUserData();
  }, [isAdding]);

  return (
    <div className={classes.root}>
      {loading ? (
        // When loading data, show centered CircularProgress
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </div>
      ) : (
        // Once data has loaded, display your component's content
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">Group Space</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <div>
              <Paper className={`${classes.paperCreat} ${classes.fixedHeight}`} onClick={AddNewGroup}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <AddIcon className={classes.addButton} fontSize="large" />
                  <Typography>Create a new group</Typography>
                </Box>
              </Paper>
              <Dialog
                open={isAdding}
                TransitionComponent={Slide}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                fullWidth
              >
                <Grid container style={{ padding: "20px" }}>
                  <Grid item xs={12}>
                    <Typography variant="h5">Create Team</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Team Name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      label="Team Description"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      inputProps={{ maxLength: 200 }}
                    />
                  </Grid>

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
                    <List>
                      {searchResults.map((user) => (
                        <ListItem
                          className={classes.listItem}
                          button
                          key={user.id}
                          onClick={() => addMember(user)}
                        >
                          {user.name}
                        </ListItem>
                      ))}
                    </List>
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

                  <Grid item xs={12}>
                    <Button onClick={handleClose}>Back</Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={submitForm}
                    >
                      Create Team
                    </Button>
                  </Grid>
                </Grid>
              </Dialog>
            </div>
          </Grid>

          {groups.map((group, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper className={`${classes.paper} ${classes.fixedHeight}`}>
                <div>
                  <Typography
                    variant="h6"
                    align="left"
                    className={classes.groupName}
                  >
                    {group.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="left"
                    className={classes.joined_at}
                  >
                    {group.joined_at.replace("T", " ")}
                  </Typography>
                </div>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to={`/group/${group.team_id}`}
                >
                  View
                </Button>
              </Paper>
            </Grid>
          ))}
          <UserGuideDialog open={showGuideDialog} onClose={handleCloseGuideDialog} />

        </Grid>

      )}
    </div>
  );

}
