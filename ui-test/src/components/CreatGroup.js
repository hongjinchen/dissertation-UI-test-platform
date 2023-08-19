// 页面标题：显示为 "创建团队"。
// 团队名称输入框：一个标签为 "团队名称" 的输入框，供管理员输入团队名称。
// 团队描述输入框：一个标签为 "团队描述" 的多行输入框，供管理员输入对团队的简短描述。可以设置一个最大字符数限制（例如，200 字符）以避免过长的描述。
// 成员搜索框：一个标签为 "搜索成员" 的输入框，允许管理员输入用户 ID 或昵称以搜索潜在成员。可以提供自动完成功能，以便于管理员查找和添加成员。
// 成员搜索结果列表：在搜索框下方显示一个用户搜索结果的列表。列表中的每个用户都应该有一个 "添加" 按钮，以便管理员将他们添加到团队成员列表中。
// 团队成员列表：显示已添加到团队的成员。对于每个成员，可以提供一个下拉菜单来选择角色（例如，管理员、开发者、测试人员等）。还可以提供一个 "删除" 按钮，以便从团队成员列表中删除成员。
// 隐私设置：提供一个标签为 "团队可见性" 的下拉菜单，让管理员选择团队的可见性。可见性选项可以包括 "公开"（任何人都可以查看和请求加入）和 "私有"（仅受邀请的成员可以查看和加入）。
// 提交按钮：一个 "创建团队" 的按钮，管理员可以点击该按钮来提交创建团队的表单。

import React, { useState } from "react";
import Cookies from 'js-cookie';

import {
  Typography,
  TextField,
  Grid,
  Button,
  ListItem,
  List,
  makeStyles,
  Paper,
  Box,
  Dialog,
  Slide,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import { createTeam, searchUsers } from "../api";


const useStyles = makeStyles((theme) => ({
  paper: {
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
}));

export default function CreateTeam() {
  const classes = useStyles();

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
    console.log("close");
    resetForm();
    setIsAdding(false);
  };
  return (
    <div>
      <Paper className={classes.paper} onClick={AddNewGroup}>
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
            <Paper className={classes.searchResults} elevation={1}>
              <List>
                {searchResults.map((user) => (
                  <ListItem
                    className={classes.listItem}
                    button
                    key={user.id}
                    onClick={() => addMember(user)}
                  >
                    <ListItemAvatar>
                      <Avatar>{user.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
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
  );
}
