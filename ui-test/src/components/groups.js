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
} from "@material-ui/core";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { createTeam, searchUsers, fetchUserTeams } from "../api";
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
    height: "14vh", // 设置一个固定高度，可以根据实际需求进行调整
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();

  // 新建team部分的逻辑
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [searchUserName, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

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
    setTeamMembers([...teamMembers, user]);
  };

  const removeMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const submitForm = async () => {
    const response = await createTeam(teamName, teamDescription, teamMembers, Cookies.get('userId'));
    console.log(response);
    if (response.status === 'success') {
      alert('Team created successfully');
      setIsAdding(false);
    } else {
      console.log(response.error);
      alert(response.error);
    }
  };

  const [isAdding, setIsAdding] = useState(false);

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
      const response = await fetchUserTeams(Cookies.get('userId'));
      setGroups(response.data.teams);
    };

    getUserData();
  }, [isAdding]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Group Space</Typography>
        </Grid>

        <Grid item xs={3}>
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
              // maxWidth="sm"
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
          <Grid item xs={3} key={index}>
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
                  {group.joined_at}
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
      </Grid>
    </div>
  );
}
